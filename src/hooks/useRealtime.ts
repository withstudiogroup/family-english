"use client";

import { useState, useRef, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UseRealtimeOptions {
  scenario: string;
  level: "beginner" | "intermediate" | "advanced";
  onMessage?: (message: Message) => void;
  onError?: (error: string) => void;
}

export function useRealtime(options: UseRealtimeOptions) {
  const { scenario, level, onMessage, onError } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMicrophone, setHasMicrophone] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const dataChannel = useRef<RTCDataChannel | null>(null);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);

  const levelInstructions = {
    beginner: "Speak slowly and use very simple English. Use short sentences with basic vocabulary. If the student makes mistakes, gently correct them.",
    intermediate: "Use everyday conversational English. Speak at a moderate pace. Introduce some common idioms and expressions.",
    advanced: "Speak naturally at normal pace. Use varied vocabulary and complex sentences. Challenge the student with nuanced expressions.",
  };

  const connect = useCallback(async () => {
    try {
      // 1. 세션 토큰 가져오기
      const tokenResponse = await fetch("/api/realtime/session");
      if (!tokenResponse.ok) {
        throw new Error("Failed to get session token");
      }
      const { client_secret } = await tokenResponse.json();

      // 2. WebRTC 연결 설정
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnection.current = pc;

      // ICE 연결 상태 모니터링
      pc.oniceconnectionstatechange = () => {
        console.log("ICE connection state:", pc.iceConnectionState);
        if (pc.iceConnectionState === "failed" || pc.iceConnectionState === "disconnected") {
          onError?.("연결이 끊어졌습니다. 다시 시도해주세요.");
        }
      };

      pc.onconnectionstatechange = () => {
        console.log("Connection state:", pc.connectionState);
      };

      // 3. 오디오 출력 설정 (모바일 브라우저 호환)
      const audio = document.createElement("audio");
      audio.autoplay = true;
      audio.setAttribute("playsinline", "true");
      audio.setAttribute("webkit-playsinline", "true");
      audio.style.display = "none";
      document.body.appendChild(audio);
      audioElement.current = audio;

      pc.ontrack = (event) => {
        console.log("Audio track received:", event.streams[0]);
        audio.srcObject = event.streams[0];
        // 모바일에서 오디오 재생 시작
        audio.play().catch((e) => {
          console.log("Audio play failed, will retry on user interaction:", e);
        });
        setIsAiSpeaking(true);
      };

      // 4. 마이크 입력 설정 (마이크가 없어도 텍스트로 사용 가능)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStream.current = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        console.log("Microphone connected successfully");
        setHasMicrophone(true);
      } catch (micError) {
        console.warn("Microphone not available:", micError);
        setHasMicrophone(false);
        setConnectionError("마이크를 찾을 수 없습니다. 마이크 권한을 확인해주세요.");
        // 마이크 없으면 연결 중단
        throw new Error("마이크가 필요합니다");
      }

      // 5. 데이터 채널 설정 (텍스트 통신용)
      const dc = pc.createDataChannel("oai-events");
      dataChannel.current = dc;

      dc.onopen = () => {
        // 시스템 프롬프트 전송
        const systemPrompt = {
          type: "session.update",
          session: {
            instructions: `You are a friendly English teacher helping a Korean family learn English through role-play scenarios.

Current scenario: "${scenario}"
Student level: ${level}

${levelInstructions[level]}

Important guidelines:
- Always stay in character for the scenario
- After each student response, briefly acknowledge what they said
- If they speak Korean, gently encourage them to try in English
- Keep responses concise (1-2 sentences)
- Be encouraging and supportive

Start by greeting the student and setting up the scenario context in English.`,
            voice: "alloy",
            input_audio_transcription: { model: "whisper-1" },
          },
        };
        dc.send(JSON.stringify(systemPrompt));

        // 응답 생성 요청
        dc.send(JSON.stringify({ type: "response.create" }));
      };

      dc.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "response.audio_transcript.done":
            // AI 응답 텍스트
            const aiMessage: Message = {
              id: crypto.randomUUID(),
              role: "assistant",
              content: data.transcript,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            onMessage?.(aiMessage);
            break;

          case "conversation.item.input_audio_transcription.completed":
            // 사용자 음성 텍스트
            const userMessage: Message = {
              id: crypto.randomUUID(),
              role: "user",
              content: data.transcript,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMessage]);
            onMessage?.(userMessage);
            break;

          case "response.audio.done":
            setIsAiSpeaking(false);
            break;

          case "error":
            onError?.(data.error?.message || "Unknown error");
            break;
        }
      };

      // 6. SDP Offer 생성 및 전송
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpResponse = await fetch(
        "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${client_secret.value}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        }
      );

      if (!sdpResponse.ok) {
        throw new Error("Failed to establish WebRTC connection");
      }

      const answerSdp = await sdpResponse.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setIsConnected(true);
    } catch (error) {
      console.error("Connection error:", error);
      onError?.(error instanceof Error ? error.message : "Connection failed");
    }
  }, [scenario, level, onMessage, onError]);

  const disconnect = useCallback(() => {
    // 마이크 스트림 정지
    mediaStream.current?.getTracks().forEach((track) => track.stop());
    mediaStream.current = null;

    // 오디오 정지 및 DOM에서 제거
    if (audioElement.current) {
      audioElement.current.pause();
      audioElement.current.srcObject = null;
      audioElement.current.remove();
      audioElement.current = null;
    }

    // WebRTC 연결 종료
    dataChannel.current?.close();
    peerConnection.current?.close();
    dataChannel.current = null;
    peerConnection.current = null;

    setIsConnected(false);
    setIsRecording(false);
    setIsAiSpeaking(false);
  }, []);

  const toggleRecording = useCallback(() => {
    if (!mediaStream.current) return;

    const audioTrack = mediaStream.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsRecording(audioTrack.enabled);
    }
  }, []);

  const sendTextMessage = useCallback((text: string) => {
    if (!dataChannel.current || dataChannel.current.readyState !== "open") {
      return;
    }

    // 텍스트 메시지 전송
    const event = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text }],
      },
    };
    dataChannel.current.send(JSON.stringify(event));

    // 응답 요청
    dataChannel.current.send(JSON.stringify({ type: "response.create" }));

    // 로컬 메시지 추가
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    onMessage?.(userMessage);
  }, [onMessage]);

  return {
    isConnected,
    isRecording,
    isAiSpeaking,
    messages,
    hasMicrophone,
    connectionError,
    connect,
    disconnect,
    toggleRecording,
    sendTextMessage,
  };
}

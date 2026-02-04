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
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setDebugLogs(prev => [...prev.slice(-20), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

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
    setConnectionError(null);
    setDebugLogs([]);
    addLog("=== 연결 시작 ===");

    try {
      // 1. 세션 토큰 가져오기
      addLog("1단계: 세션 토큰 요청 중...");
      const tokenResponse = await fetch("/api/realtime/session");
      addLog(`토큰 응답: ${tokenResponse.status}`);

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        addLog(`토큰 에러: ${errorText}`);
        throw new Error("세션 토큰을 가져올 수 없습니다");
      }

      const sessionData = await tokenResponse.json();
      addLog(`세션 데이터: ${sessionData.id ? "성공" : "실패"}`);

      if (!sessionData.client_secret) {
        addLog("client_secret 없음!");
        throw new Error("세션 토큰이 올바르지 않습니다");
      }

      const { client_secret } = sessionData;

      // 2. WebRTC 연결 설정
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnection.current = pc;

      // ICE 연결 상태 모니터링
      pc.oniceconnectionstatechange = () => {
        addLog(`ICE 상태: ${pc.iceConnectionState}`);
        if (pc.iceConnectionState === "failed" || pc.iceConnectionState === "disconnected") {
          onError?.("연결이 끊어졌습니다. 다시 시도해주세요.");
        }
      };

      pc.onconnectionstatechange = () => {
        addLog(`연결 상태: ${pc.connectionState}`);
      };

      pc.onicegatheringstatechange = () => {
        addLog(`ICE 수집: ${pc.iceGatheringState}`);
      };

      // 3. 오디오 출력 설정 (모바일 브라우저 호환)
      const audio = document.createElement("audio");
      audio.autoplay = true;
      audio.muted = false;
      audio.volume = 1.0;
      audio.setAttribute("playsinline", "true");
      audio.setAttribute("webkit-playsinline", "true");
      audio.style.cssText = "position:fixed;top:-1000px;left:-1000px;";
      document.body.appendChild(audio);
      audioElement.current = audio;

      // 오디오 수신용 트랜시버 추가
      pc.addTransceiver("audio", { direction: "recvonly" });

      pc.ontrack = (event) => {
        addLog("🔊 오디오 트랙 수신!");
        addLog(`트랙 종류: ${event.track.kind}, 상태: ${event.track.readyState}`);

        const stream = event.streams[0];
        audio.srcObject = stream;

        // 모바일에서 오디오 재생 시작
        const playAudio = () => {
          audio.play().then(() => {
            addLog("✅ 오디오 재생 성공!");
          }).catch((e) => {
            addLog(`⚠️ 오디오 재생 실패: ${e.message}`);
            // 사용자 인터랙션 대기
            document.addEventListener("click", () => {
              audio.play().then(() => addLog("✅ 클릭 후 오디오 재생 성공"));
            }, { once: true });
          });
        };

        playAudio();
        setIsAiSpeaking(true);
      };

      // 4. 마이크 입력 설정
      addLog("4단계: 마이크 권한 요청...");
      addLog(`mediaDevices 지원: ${!!navigator.mediaDevices}`);

      try {
        // 먼저 사용 가능한 오디오 장치 확인
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(d => d.kind === "audioinput");
        addLog(`오디오 입력 장치: ${audioInputs.length}개`);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStream.current = stream;
        stream.getTracks().forEach((track) => {
          addLog(`마이크 트랙: ${track.label || "이름없음"}`);
          pc.addTrack(track, stream);
        });
        addLog("마이크 연결 성공!");
        setHasMicrophone(true);
        setIsRecording(true); // 마이크 기본 활성화
      } catch (micError: unknown) {
        const errorMessage = micError instanceof Error ? micError.message : String(micError);
        const errorName = micError instanceof Error ? micError.name : "Unknown";
        addLog(`마이크 에러: ${errorName} - ${errorMessage}`);
        setHasMicrophone(false);

        if (errorName === "NotFoundError") {
          setConnectionError("마이크를 찾을 수 없습니다. 마이크가 연결되어 있는지 확인해주세요.");
        } else if (errorName === "NotAllowedError") {
          setConnectionError("마이크 권한이 거부되었습니다. 브라우저 설정에서 마이크를 허용해주세요.");
        } else {
          setConnectionError(`마이크 오류: ${errorMessage}`);
        }
        throw micError;
      }

      // 5. 데이터 채널 설정 (텍스트 통신용)
      addLog("5단계: 데이터 채널 생성...");
      const dc = pc.createDataChannel("oai-events");
      dataChannel.current = dc;

      dc.onopen = () => {
        addLog("✅ 데이터 채널 열림!");
        // 시스템 프롬프트 전송
        const systemPrompt = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            voice: "alloy",
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
            input_audio_transcription: { model: "whisper-1" },
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 500,
            },
          },
        };
        dc.send(JSON.stringify(systemPrompt));
        addLog("시스템 프롬프트 전송 완료");

        // 응답 생성 요청
        dc.send(JSON.stringify({ type: "response.create" }));
        addLog("응답 생성 요청 전송");
      };

      dc.onerror = (error) => {
        addLog(`❌ 데이터 채널 에러: ${error}`);
      };

      dc.onclose = () => {
        addLog("데이터 채널 닫힘");
      };

      dc.onmessage = (event) => {
        const data = JSON.parse(event.data);
        addLog(`📨 수신: ${data.type}`);

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

          case "conversation.item.input_audio_transcription.failed":
            addLog(`❌ 음성인식 실패: ${JSON.stringify(data)}`);
            break;

          case "response.audio.delta":
            // 오디오 데이터 수신 중
            break;

          case "response.audio.done":
            setIsAiSpeaking(false);
            break;

          case "response.output_item.added":
            addLog("🎤 AI 응답 시작");
            break;

          case "error":
            addLog(`❌ API 에러: ${data.error?.message || JSON.stringify(data)}`);
            onError?.(data.error?.message || "Unknown error");
            break;
        }
      };

      // 6. SDP Offer 생성 및 전송
      addLog("6단계: SDP 오퍼 생성...");
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      addLog("SDP 오퍼 생성 완료");

      addLog("7단계: OpenAI에 SDP 전송...");
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

      addLog(`SDP 응답: ${sdpResponse.status}`);
      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        addLog(`SDP 에러: ${errorText}`);
        throw new Error("WebRTC 연결에 실패했습니다");
      }

      const answerSdp = await sdpResponse.text();
      addLog("8단계: 원격 설명 설정...");
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      addLog("=== 연결 성공! ===");
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
    debugLogs,
    connect,
    disconnect,
    toggleRecording,
    sendTextMessage,
  };
}

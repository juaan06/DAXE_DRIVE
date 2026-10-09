import { useEffect, useRef, useState } from 'react';
import fondoHorizontal from './fondo_login.mp4';
import fondoVertical from './fondo_login_vertical.mp4';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const actualizarCoincidencia = (event) => setMatches(event.matches);

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', actualizarCoincidencia);
    return () => mediaQuery.removeEventListener('change', actualizarCoincidencia);
  }, [query]);

  return matches;
}

export default function VideoAcceso({ tiempoObjetivo }) {
  const videoRef = useRef(null);
  const tiempoAnterior = useRef(null);
  const [origenListo, setOrigenListo] = useState('');
  const esMovil = useMediaQuery('(max-width: 700px)');
  const origenVideo = esMovil ? fondoVertical : fondoHorizontal;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || origenListo !== origenVideo || !Number.isFinite(video.duration)) {
      return;
    }

    const tiempo = Math.min(Math.max(tiempoObjetivo, 0), video.duration);

    if (tiempoAnterior.current !== null && tiempo < tiempoAnterior.current) {
      video.pause();
      video.currentTime = tiempo;
      tiempoAnterior.current = tiempo;
      return;
    }

    tiempoAnterior.current = tiempo;
    if (video.currentTime >= tiempo) {
      video.currentTime = tiempo;
      video.pause();
      return;
    }

    video.play().catch((error) => {
      console.warn('No se pudo reproducir el video de fondo.', error);
    });
  }, [tiempoObjetivo, origenVideo, origenListo]);

  const pausarEnHito = () => {
    const video = videoRef.current;
    if (!video || origenListo !== origenVideo || !Number.isFinite(video.duration)) {
      return;
    }

    const tiempo = Math.min(Math.max(tiempoObjetivo, 0), video.duration);
    if (video.currentTime >= tiempo) {
      video.currentTime = tiempo;
      video.pause();
    }
  };

  return (
    <>
      <video
        key={origenVideo}
        ref={videoRef}
        src={origenVideo}
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex="-1"
        onLoadedMetadata={() => setOrigenListo(origenVideo)}
        onTimeUpdate={pausarEnHito}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#05060c]/75 via-[#05060c]/35 to-[#05060c]/70 max-sm:bg-gradient-to-b max-sm:from-[#05060c]/50 max-sm:via-[#05060c]/70 max-sm:to-[#05060c]/85"
      />
    </>
  );
}

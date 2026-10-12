import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);

let _resolve, _promise;
const init = () => (_promise ||= new Promise(r => { _resolve = r; }));
export const ready = () => (typeof window === 'undefined' ? Promise.resolve() : init());
export const markReady = () => { init(); _resolve(); };

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };

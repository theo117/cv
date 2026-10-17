"use client";
import { useEffect } from "react";
export default function PortfolioMotion() {
    useEffect(() => {
        const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (reduced.matches)
            return;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: .08 });
        elements.forEach(element => { element.classList.add("will-reveal"); observer.observe(element); });
        const onChange = () => { if (reduced.matches)
            elements.forEach(element => element.classList.remove("will-reveal")); };
        reduced.addEventListener("change", onChange);
        return () => { observer.disconnect(); reduced.removeEventListener("change", onChange); elements.forEach(element => element.classList.remove("will-reveal")); };
    }, []);
    return null;
}

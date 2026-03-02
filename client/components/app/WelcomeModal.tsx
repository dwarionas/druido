"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

interface Props {
    onDismiss: () => void;
}

export default function WelcomeModal({ onDismiss }: Props) {
    const { t } = useI18n();
    const [step, setStep] = React.useState(0);

    const steps = [
        { emoji: "🗂️", titleKey: "onboarding.step1.title", descKey: "onboarding.step1.desc" },
        { emoji: "🃏", titleKey: "onboarding.step2.title", descKey: "onboarding.step2.desc" },
        { emoji: "🧠", titleKey: "onboarding.step3.title", descKey: "onboarding.step3.desc" },
    ];

    const current = steps[step];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-background border rounded-2xl shadow-xl max-w-md w-full p-8 text-center pt-10">
                <div className="text-6xl mb-6">{current.emoji}</div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">{t(current.titleKey)}</h2>
                <p className="text-sm text-muted-foreground mb-8 text-balance">{t(current.descKey)}</p>

                {/* Step indicators */}
                <div className="flex justify-center gap-2 mb-8">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-primary" : "w-1.5 bg-primary/20"
                                }`}
                        />
                    ))}
                </div>

                <div className="flex gap-3 justify-center mt-2">
                    {step < steps.length - 1 ? (
                        <>
                            <Button variant="ghost" className="flex-1" onClick={onDismiss}>
                                {t("onboarding.skip")}
                            </Button>
                            <Button className="flex-1" onClick={() => setStep(step + 1)}>
                                {t("onboarding.next")}
                            </Button>
                        </>
                    ) : (
                        <Button className="w-full" size="lg" onClick={onDismiss}>
                            {t("onboarding.start")} 🚀
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

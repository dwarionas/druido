"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useI18n, LanguageSwitcher } from "@/lib/i18n";
import { updateProfile, changePassword } from "@/lib/decks-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ProfilePage() {
    const { user, updateUser } = useAuth();
    const { t } = useI18n();

    const [name, setName] = React.useState(user?.name ?? "");
    const [dailyGoal, setDailyGoal] = React.useState(user?.dailyGoal ?? 20);
    const [saving, setSaving] = React.useState(false);

    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [changingPassword, setChangingPassword] = React.useState(false);

    React.useEffect(() => {
        if (user) {
            setName(user.name ?? "");
            setDailyGoal(user.dailyGoal ?? 20);
        }
    }, [user]);

    async function handleSaveProfile(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            const updated = await updateProfile({ name: name.trim(), dailyGoal });
            updateUser(updated);
            toast.success(t("profile.saved"));
        } catch {
            toast.error("Error saving profile");
        } finally {
            setSaving(false);
        }
    }

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();
        if (!currentPassword || !newPassword || newPassword.length < 6) return;
        setChangingPassword(true);
        try {
            await changePassword({ currentPassword, newPassword });
            toast.success(t("profile.password_changed"));
            setCurrentPassword("");
            setNewPassword("");
        } catch {
            toast.error("Incorrect current password");
        } finally {
            setChangingPassword(false);
        }
    }

    if (!user) return null;

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-xl pb-10 mx-auto w-full">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("profile.title")}</h1>

            {/* Profile info */}
            <form onSubmit={handleSaveProfile} className="bg-card border rounded-2xl p-6 shadow-sm space-y-5">
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">{t("profile.email")}</Label>
                    <Input value={user.email} disabled className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">{t("profile.name")}</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("profile.name")} />
                </div>
                <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">{t("profile.daily_goal")}</Label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min={1}
                            max={100}
                            value={dailyGoal}
                            onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                            className="flex-1 accent-primary h-2"
                        />
                        <span className="w-12 text-center text-sm font-medium text-foreground border rounded-md py-1.5 bg-background shadow-inner">{dailyGoal}</span>
                    </div>
                </div>
                <Button type="submit" disabled={saving}>
                    {saving ? "..." : t("profile.save")}
                </Button>
            </form>

            {/* Language */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4">{t("profile.language")}</h2>
                <LanguageSwitcher />
            </div>

            {/* Change password */}
            <form onSubmit={handleChangePassword} className="bg-card border rounded-2xl p-6 shadow-sm space-y-5">
                <h2 className="text-lg font-semibold text-foreground">{t("profile.change_password")}</h2>
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">{t("profile.current_password")}</Label>
                    <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">{t("profile.new_password")}</Label>
                    <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="min 6 characters" />
                </div>
                <Button type="submit" disabled={changingPassword || !currentPassword || newPassword.length < 6}>
                    {changingPassword ? "..." : t("profile.change_password")}
                </Button>
            </form>

            {/* Danger zone */}
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 space-y-2">
                <h2 className="text-lg font-semibold text-destructive">{t("profile.danger_zone")}</h2>
                <p className="text-sm text-destructive/80">{t("profile.delete_info")}</p>
            </div>

            {/* Stats summary */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm flex items-center justify-between text-sm font-medium text-foreground flex-wrap gap-4">
                <div className="flex items-center gap-6">
                    <span className="inline-flex items-center gap-1.5"><span className="text-orange-500">🔥</span> {user.streak} {t("stats.streak")}</span>
                    <span className="inline-flex items-center gap-1.5"><span className="text-yellow-500">⭐</span> {user.xp} XP</span>
                </div>
                {user.createdAt && (
                    <span className="text-muted-foreground">{t("stats.member_since")} {new Date(user.createdAt).toLocaleDateString()}</span>
                )}
            </div>
        </div>
    );
}

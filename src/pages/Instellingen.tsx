import { useState } from "react";
import { Bell, Palette, Globe, Pencil, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { usePersistedState } from "@/lib/api";
import type { SettingsState } from "@/lib/app-types";

const defaultSettings: SettingsState = {
  profile: { bedrijfsnaam: "", email: "", website: "" },
  notif: { email: true, push: true, weeklyReport: false, campagneAlerts: true },
  branding: { primaryColor: "#E8A0BF", logoUrl: "", slogan: "" },
  channels: { instagram: "", tiktok: "", facebook: "", youtube: "" },
};

const Instellingen = () => {
  const { t } = useLanguage();
  const { value, setValue, loading } = usePersistedState<SettingsState>("settings", defaultSettings);
  const [editProfile, setEditProfile] = useState(false);
  const [editBrand, setEditBrand] = useState(false);
  const [editChannels, setEditChannels] = useState(false);

  const saveSettings = async (updater: (current: SettingsState) => SettingsState, toastTitle?: string) => {
    await setValue(updater);
    if (toastTitle) {
      toast({ title: toastTitle });
    }
  };

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-foreground">{t("settings.title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      {loading && (
        <div className="glass-card mb-6 max-w-2xl rounded-xl p-4 text-sm text-muted-foreground">
          Instellingen worden geladen...
        </div>
      )}

      <div className="max-w-2xl space-y-6">
        <div className="glass-card rounded-xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground">{t("settings.companyProfile")}</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (editProfile) {
                  toast({ title: t("settings.profileSaved") });
                }
                setEditProfile(!editProfile);
              }}
            >
              {editProfile ? <><Check className="mr-1 h-3 w-3" />{t("common.save")}</> : <><Pencil className="mr-1 h-3 w-3" />{t("common.edit")}</>}
            </Button>
          </div>
          <div className="space-y-3">
            <div>
              <Label>{t("settings.companyName")}</Label>
              <Input disabled={!editProfile} value={value.profile.bedrijfsnaam} onChange={(event) => void saveSettings((current) => ({ ...current, profile: { ...current.profile, bedrijfsnaam: event.target.value } }))} />
            </div>
            <div>
              <Label>{t("team.email")}</Label>
              <Input disabled={!editProfile} value={value.profile.email} onChange={(event) => void saveSettings((current) => ({ ...current, profile: { ...current.profile, email: event.target.value } }))} />
            </div>
            <div>
              <Label>{t("common.website")}</Label>
              <Input disabled={!editProfile} value={value.profile.website} onChange={(event) => void saveSettings((current) => ({ ...current, profile: { ...current.profile, website: event.target.value } }))} />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <h3 className="font-display font-semibold text-foreground">{t("settings.notifications")}</h3>
          </div>
          <div className="space-y-4">
            {([
              { key: "email" as const, label: t("settings.emailNotifications"), desc: t("settings.emailNotificationsDesc") },
              { key: "push" as const, label: t("settings.pushNotifications"), desc: t("settings.pushNotificationsDesc") },
              { key: "weeklyReport" as const, label: t("settings.weeklyReport"), desc: t("settings.weeklyReportDesc") },
              { key: "campagneAlerts" as const, label: t("settings.campaignAlerts"), desc: t("settings.campaignAlertsDesc") },
            ]).map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch
                  checked={value.notif[item.key]}
                  onCheckedChange={(checked) =>
                    void saveSettings(
                      (current) => ({ ...current, notif: { ...current.notif, [item.key]: checked } }),
                      `${item.label} ${checked ? t("settings.turnedOn") : t("settings.turnedOff")}`,
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              <h3 className="font-display font-semibold text-foreground">{t("settings.branding")}</h3>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (editBrand) {
                  toast({ title: t("settings.brandingSaved") });
                }
                setEditBrand(!editBrand);
              }}
            >
              {editBrand ? <><Check className="mr-1 h-3 w-3" />{t("common.save")}</> : <><Pencil className="mr-1 h-3 w-3" />{t("common.edit")}</>}
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Label className="w-28">{t("settings.primaryColor")}</Label>
              <input
                type="color"
                disabled={!editBrand}
                value={value.branding.primaryColor}
                onChange={(event) => void saveSettings((current) => ({ ...current, branding: { ...current.branding, primaryColor: event.target.value } }))}
                className="h-10 w-10 cursor-pointer rounded border-0"
              />
              <span className="text-sm text-muted-foreground">{value.branding.primaryColor}</span>
            </div>
            <div>
              <Label>{t("settings.logoUrl")}</Label>
              <Input disabled={!editBrand} value={value.branding.logoUrl} onChange={(event) => void saveSettings((current) => ({ ...current, branding: { ...current.branding, logoUrl: event.target.value } }))} />
            </div>
            <div>
              <Label>{t("settings.slogan")}</Label>
              <Input disabled={!editBrand} value={value.branding.slogan} onChange={(event) => void saveSettings((current) => ({ ...current, branding: { ...current.branding, slogan: event.target.value } }))} />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <h3 className="font-display font-semibold text-foreground">{t("settings.channels")}</h3>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (editChannels) {
                  toast({ title: t("settings.channelsSaved") });
                }
                setEditChannels(!editChannels);
              }}
            >
              {editChannels ? <><Check className="mr-1 h-3 w-3" />{t("common.save")}</> : <><Pencil className="mr-1 h-3 w-3" />{t("common.edit")}</>}
            </Button>
          </div>
          <div className="space-y-3">
            {(["instagram", "tiktok", "facebook", "youtube"] as const).map((channelKey) => (
              <div key={channelKey}>
                <Label>{channelKey.charAt(0).toUpperCase() + channelKey.slice(1)}</Label>
                <Input
                  disabled={!editChannels}
                  value={value.channels[channelKey]}
                  onChange={(event) =>
                    void saveSettings((current) => ({
                      ...current,
                      channels: { ...current.channels, [channelKey]: event.target.value },
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instellingen;

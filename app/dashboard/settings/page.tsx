"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TEXT } from "@/lib/constants/text";
import SettingsSection from "@/components/dashboard/SettingsSection";
import ChangePasswordForm from "@/components/dashboard/ChangePasswordForm";
import { supabase } from "@/lib/supabase/client";
import { NotificationService } from "@/lib/services/notification";

export default function SettingsPage() {
  const [preferenceSuccess, setPreferenceSuccess] = useState(false);
  const [preferenceError, setPreferenceError] = useState("");
  const [notificationSuccess, setNotificationSuccess] = useState(false);
  const [notificationError, setNotificationError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [dailyGoal, setDailyGoal] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState("20:00");

  useEffect(() => {
    const getUserData = async () => {
      // 获取用户信息
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
        // 获取用户偏好设置
        const { data: preferences, error } = await supabase
          .from("user_preferences")
          .select("daily_goal")
          .eq("user_id", user.id)
          .single();

        if (!error && preferences) {
          setDailyGoal(preferences.daily_goal);
        }
      }
    };
    getUserData();
  }, []);

  const [previousValues, setPreviousValues] = useState({
    dailyGoal: 10,
    dailyReminder: true,
    reminderTime: "20:00",
  });

  // 添加自动隐藏偏好设置成功提示的 Effect
  useEffect(() => {
    if (preferenceSuccess) {
      const timer = setTimeout(() => {
        setPreferenceSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [preferenceSuccess]);

  // 在修改值之前保存之前的值
  const handleDailyGoalChange = async (value: string) => {
    setLoading(true);
    setError("");
    setPreferenceError("");
    setPreferenceSuccess(false);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // 先检查是否存在记录
      const { data: existingPreference } = await supabase
        .from("user_preferences")
        .select("id")
        .eq("user_id", user.id)
        .single();

      let error;
      if (existingPreference) {
        // 更新现有记录
        const { error: updateError } = await supabase
          .from("user_preferences")
          .update({
            daily_goal: parseInt(value),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);
        error = updateError;
      } else {
        // 插入新记录
        const { error: insertError } = await supabase
          .from("user_preferences")
          .insert({
            user_id: user.id,
            daily_goal: parseInt(value),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        error = insertError;
      }

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      setDailyGoal(parseInt(value));
      setPreferenceSuccess(true);
    } catch (err) {
      console.error("Update error:", err);
      setPreferenceError(TEXT.dashboard.settings.preferences.updateError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // 获取用户偏好设置代码保持不变

        // 获取通知设置
        const { data: notificationSettings, error: notificationError } =
          await supabase
            .from("notification_settings")
            .select("daily_reminder, reminder_time")
            .eq("user_id", user.id)
            .single();

        if (!notificationError && notificationSettings) {
          setDailyReminder(notificationSettings.daily_reminder);
          setReminderTime(notificationSettings.reminder_time);
        }
      }
    };
    getUserData();
  }, []);

  // 添加自动隐藏成功提示的 Effect
  useEffect(() => {
    if (notificationSuccess) {
      const timer = setTimeout(() => {
        setNotificationSuccess(false);
      }, 3000); // 3秒后自动隐藏
      return () => clearTimeout(timer);
    }
  }, [notificationSuccess]);

  const handleNotificationChange = async (enabled: boolean) => {
    setLoading(true);
    setNotificationError("");
    setNotificationSuccess(false);

    try {
      if (enabled) {
        // 请求通知权限
        const permissionGranted = await NotificationService.requestPermission();
        if (!permissionGranted) {
          setNotificationError(
            TEXT.dashboard.settings.notifications.permissionDenied
          );
          return;
        }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // 先检查是否存在记录
      const { data: existingSettings } = await supabase
        .from("notification_settings")
        .select("id")
        .eq("user_id", user.id)
        .single();

      let error;
      if (existingSettings) {
        // 更新现有记录
        const { error: updateError } = await supabase
          .from("notification_settings")
          .update({
            daily_reminder: enabled,
            reminder_time: reminderTime,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);
        error = updateError;
      } else {
        // 插入新记录
        const { error: insertError } = await supabase
          .from("notification_settings")
          .insert({
            user_id: user.id,
            daily_reminder: enabled,
            reminder_time: reminderTime,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        error = insertError;
      }

      if (error) throw error;

      setDailyReminder(enabled);

      // 只在取消勾选时显示成功提示
      if (!enabled) {
        setNotificationSuccess(true);
      }
    } catch (err) {
      console.error("Notification update error:", err);
      setNotificationError(TEXT.dashboard.settings.notifications.updateError);
    } finally {
      setLoading(false);
    }
  };

  // 添加时间修改处理函数
  const handleTimeChange = async (time: string) => {
    setPreviousValues((prev) => ({
      ...prev,
      reminderTime: reminderTime,
    }));
    setLoading(true);
    setNotificationError("");
    setNotificationSuccess(false);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("notification_settings")
        .update({
          reminder_time: time,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setReminderTime(time);
      // 更新提醒时间
      if (dailyReminder) {
        NotificationService.scheduleNotification(time, user.id);
      }
      setNotificationSuccess(true);
    } catch (err) {
      console.error("Time update error:", err);
      setNotificationError(TEXT.dashboard.settings.notifications.updateError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{TEXT.dashboard.settings.title}</h1>
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2">
            <span>←</span> {TEXT.common.backToDashboard}
          </Button>
        </Link>
      </div>

      {/* 账户设置 */}
      <SettingsSection
        title={TEXT.dashboard.settings.account.title}
        description={TEXT.dashboard.settings.account.description}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              {TEXT.dashboard.settings.account.email}
            </label>
            <input
              type="email"
              disabled
              value={userEmail || "用户"}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50"
            />
          </div>

          {!showPasswordForm ? (
            <Button variant="outline" onClick={() => setShowPasswordForm(true)}>
              {TEXT.dashboard.settings.account.changePassword}
            </Button>
          ) : (
            <div className="space-y-4">
              <ChangePasswordForm userEmail={userEmail} />
              <Button
                variant="ghost"
                onClick={() => setShowPasswordForm(false)}
                className="text-gray-600"
              >
                {TEXT.common.cancel}
              </Button>
            </div>
          )}
        </div>
      </SettingsSection>

      {/* 学习偏好 */}
      <SettingsSection
        title={TEXT.dashboard.settings.preferences.title}
        description={TEXT.dashboard.settings.preferences.description}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {TEXT.dashboard.settings.preferences.dailyGoal}
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={dailyGoal}
              onChange={(e) => handleDailyGoalChange(e.target.value)}
              disabled={loading}
            >
              <option value="10">10 个单词/天</option>
              <option value="20">20 个单词/天</option>
              <option value="30">30 个单词/天</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            {preferenceError && (
              <p className="text-sm text-red-600">{preferenceError}</p>
            )}
            {preferenceSuccess && (
              <p className="text-sm text-green-600">
                {TEXT.dashboard.settings.preferences.updateSuccess}
              </p>
            )}
          </div>
        </div>
      </SettingsSection>

      {/* 通知设置 */}
      <SettingsSection
        title={TEXT.dashboard.settings.notifications.title}
        description={TEXT.dashboard.settings.notifications.description}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">
              {TEXT.dashboard.settings.notifications.dailyReminder}
            </span>
            <input
              type="checkbox"
              checked={dailyReminder}
              onChange={(e) => handleNotificationChange(e.target.checked)}
              disabled={loading}
              className="toggle"
            />
          </div>
          {dailyReminder && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {TEXT.dashboard.settings.notifications.reminderTime}
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    onBlur={(e) => handleTimeChange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            {notificationError && (
              <p className="text-sm text-red-600">{notificationError}</p>
            )}
            {notificationSuccess && (
              <>
                <p className="text-sm text-green-600">
                  {TEXT.dashboard.settings.notifications.updateSuccess}
                </p>
              </>
            )}
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}

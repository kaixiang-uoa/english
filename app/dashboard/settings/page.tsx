"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TEXT } from "@/lib/constants/text";
import SettingsSection from "@/components/dashboard/SettingsSection";
import ChangePasswordForm from "@/components/dashboard/ChangePasswordForm";
import { supabase } from "@/lib/supabase/client";
import { NotificationService } from "@/lib/services/notification";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

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
  
  // 添加数据管理相关状态
  const [resetStatsDialogOpen, setResetStatsDialogOpen] = useState(false);
  const [clearRecordsDialogOpen, setClearRecordsDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [dataActionLoading, setDataActionLoading] = useState(false);

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

  // 重置统计数据
  const handleResetStats = async () => {
    setDataActionLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      console.log("开始重置统计数据");

      // 直接重置词汇数据，跳过查询可能不存在的user_stats表
      console.log("开始重置词汇数据");
      const { error } = await supabase
        .from("words")
        .update({
          last_review_at: null,        // 清除最后复习时间
          review_count: 0,             // 重置复习次数
          reviewed: false,             // 重置已学习标记
          extra_json: null,            // 清除可能包含复习记录的额外数据
          difficulty: 3                // 重置难度为默认值
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("重置词汇数据失败:", error);
        throw error;
      } else {
        console.log("成功重置词汇数据");
      }

      // 提醒用户重置成功
      toast.success("统计数据已重置");
      setResetStatsDialogOpen(false);
      setConfirmText("");
      setConfirmChecked(false);
      
      // 延迟刷新页面，确保数据库操作完成
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("重置统计数据失败");
      console.error("重置统计数据错误:", error);
    } finally {
      setDataActionLoading(false);
    }
  };

  // 清除学习记录
  const handleClearRecords = async () => {
    setDataActionLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // 重置所有学习状态和复习记录，保留单词本身
      const { error } = await supabase
        .from("words")
        .update({
          last_review_at: null,
          review_count: 0,
          reviewed: false,
          difficulty: 3, // 重置难度为中等
          extra_json: null // 清空额外数据
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("学习记录已清除");
      setClearRecordsDialogOpen(false);
      setConfirmText("");
      setConfirmChecked(false);
    } catch (error) {
      toast.error("清除学习记录失败");
      console.error("Clear records error:", error);
    } finally {
      setDataActionLoading(false);
    }
  };

  // 检查重置统计对话框中的确认是否有效
  const isResetConfirmValid = confirmText === "RESET" || confirmChecked;

  // 检查清除记录对话框中的确认是否有效
  const isClearConfirmValid = confirmText === "DELETE" || confirmChecked;

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

      {/* 数据管理 */}
      <SettingsSection
        title="数据管理"
        description="以下操作将永久影响您的学习数据，请谨慎操作"
      >
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-medium">重置学习统计</h3>
                <p className="text-sm text-gray-600 mt-1">
                  此操作将重置您的连续学习天数和学习进度统计，但不会删除您的单词数据
                </p>
                <Button 
                  variant="outline" 
                  className="mt-3 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => setResetStatsDialogOpen(true)}
                >
                  重置统计数据
                </Button>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium">清除学习记录</h3>
                <p className="text-sm text-gray-600 mt-1">
                  此操作将删除您的所有学习记录，包括已学习标记、复习次数和复习时间。
                  您的单词数据将保留，但所有学习进度将重置。此操作<span className="font-bold">不可撤销</span>。
                </p>
                <Button 
                  variant="outline" 
                  className="mt-3 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => setClearRecordsDialogOpen(true)}
                >
                  清除所有记录
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* 重置统计确认对话框 */}
      <Dialog open={resetStatsDialogOpen} onOpenChange={setResetStatsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              确认重置统计数据
            </DialogTitle>
            <DialogDescription className="pt-2">
              此操作将清除您的所有学习统计数据，包括连续学习天数和每日学习量。
              您的单词和笔记将保留。此操作<span className="font-bold">不可撤销</span>。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <div className="text-sm font-medium">请输入 "RESET" 确认操作</div>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="输入 RESET"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reset-confirm"
                checked={confirmChecked}
                onCheckedChange={(checked) => setConfirmChecked(checked === true)}
              />
              <label
                htmlFor="reset-confirm"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                我了解此操作不可撤销
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setResetStatsDialogOpen(false);
                setConfirmText("");
                setConfirmChecked(false);
              }}
            >
              取消
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
              onClick={handleResetStats}
              disabled={!isResetConfirmValid || dataActionLoading}
            >
              {dataActionLoading ? "处理中..." : "确认重置"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 清除记录确认对话框 */}
      <Dialog open={clearRecordsDialogOpen} onOpenChange={setClearRecordsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              确认清除所有学习记录
            </DialogTitle>
            <DialogDescription className="pt-2">
              此操作将清除您的所有学习记录，包括已学习标记、复习次数和复习时间。
              您的单词数据将保留，但所有学习进度将重置。此操作<span className="font-bold">不可撤销</span>。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <div className="text-sm font-medium">请输入 "DELETE" 确认操作</div>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="输入 DELETE"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="clear-confirm"
                checked={confirmChecked}
                onCheckedChange={(checked) => setConfirmChecked(checked === true)}
              />
              <label
                htmlFor="clear-confirm"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                我了解此操作不可撤销
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setClearRecordsDialogOpen(false);
                setConfirmText("");
                setConfirmChecked(false);
              }}
            >
              取消
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
              onClick={handleClearRecords}
              disabled={!isClearConfirmValid || dataActionLoading}
            >
              {dataActionLoading ? "处理中..." : "确认清除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export class NotificationService {
  static async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('该浏览器不支持通知功能')
      return false
    }

    // 添加更详细的调试信息
    console.log('当前通知权限:', Notification.permission)
    const permission = await Notification.requestPermission()
    console.log('请求后通知权限:', permission)
    return permission === 'granted'
  }

  static async sendNotification(title: string, options?: NotificationOptions) {
    if (Notification.permission !== 'granted') {
      console.log('通知权限未授予')
      return false
    }

    try {
      const notification = new Notification(title, {
        ...options,
        requireInteraction: true, // 通知会一直显示，直到用户交互
        silent: false, // 允许声音
        tag: 'english-learning', // 为通知添加标签
      })

      notification.onclick = () => {
        console.log('通知被点击')
        window.focus()
      }

      console.log('通知已发送')
      return true
    } catch (error) {
      console.error('发送通知失败:', error)
      return false
    }
  }

  static scheduleNotification(time: string, userId: string) {
    // 保存提醒设置到本地存储
    localStorage.setItem('notification_time', time);
    localStorage.setItem('notification_user', userId);

    // 检查并设置定时器
    this.checkAndSchedule();

    // 添加页面可见性变化监听
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkAndSchedule();
      }
    });
  }

  private static checkAndSchedule() {
    const time = localStorage.getItem('notification_time');
    const userId = localStorage.getItem('notification_user');
    
    if (!time || !userId) {
      console.log('未找到通知设置');
      return;
    }

    // 计算下次提醒时间
    const [hours, minutes] = time.split(':');
    const now = new Date();
    const scheduleTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      parseInt(hours),
      parseInt(minutes)
    );

    if (scheduleTime < now) {
      scheduleTime.setDate(scheduleTime.getDate() + 1);
    }

    // 打印下次提醒时间
    console.log('下次提醒时间:', scheduleTime.toLocaleString());

    // 如果距离下次提醒时间小于1分钟，立即发送通知
    const timeDiff = scheduleTime.getTime() - now.getTime();
    console.log('距离下次提醒还有(毫秒):', timeDiff);
    if (timeDiff < 60000) {
      this.sendNotification('学习提醒', {
        body: '该完成今天的单词学习了！',
        icon: '/icons/notify.png',
      });
      // 设置下一天的提醒
      scheduleTime.setDate(scheduleTime.getDate() + 1);
    }

    // 使用 requestAnimationFrame 持续检查时间
    const checkTime = () => {
      const currentTime = new Date();
      if (currentTime >= scheduleTime) {
        this.sendNotification('学习提醒', {
          body: '该完成今天的单词学习了！',
          icon: '/icons/notify.png',
        });
        // 设置下一天的提醒
        scheduleTime.setDate(scheduleTime.getDate() + 1);
      }
      requestAnimationFrame(checkTime);
    };

    requestAnimationFrame(checkTime);
  }
}
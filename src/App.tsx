import { useEffect, useState } from 'react';
import type { User, Screen, Classroom } from './types';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import ContentScreen from './screens/ContentScreen';
import HomeworkScreen from './screens/HomeworkScreen';
import CalendarScreen from './screens/CalendarScreen';
import DashboardScreen from './screens/DashboardScreen';
import AnnouncementsScreen from './screens/AnnouncementsScreen';
import AppShell from './components/AppShell';
import IdScanScreen from './screens/IdScanScreen';
import ClassroomsScreen from './screens/ClassroomsScreen';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showIdScan, setShowIdScan] = useState(false);
  const [screen, setScreen] = useState<Screen>('home');
  const [chatMode, setChatMode] = useState<'dm' | 'group'>('dm');
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('schoolpulse-theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('schoolpulse-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const handleLogin = (u: User) => {
    setUser(u);
    setScreen('home');
  };

  const handleLogout = () => {
    setUser(null);
    setScreen('home');
  };

  const handleNav = (s: Screen) => {
    if (s === 'chat') setChatMode('dm');
    setScreen(s);
  };

  if (!user) {
    if (showIdScan) {
      return <IdScanScreen onBack={() => setShowIdScan(false)} onComplete={handleLogin} />;
    }
    return (
      <LoginScreen
        onLogin={handleLogin}
        onStartIdScan={() => setShowIdScan(true)}
        dark={dark}
        onToggleTheme={() => setDark(value => !value)}
      />
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return (
          <HomeScreen
            user={user}
            onNav={handleNav}
            onSendMessage={msg => {
              // AI-intent routing based on message content
              const lower = msg.toLowerCase();
              if (lower.includes('homework') || lower.includes('assignment')) handleNav('homework');
              else if (lower.includes('note') || lower.includes('content')) handleNav('content');
              else if (lower.includes('calendar') || lower.includes('event') || lower.includes('holiday')) handleNav('calendar');
              else if (lower.includes('notice') || lower.includes('announc')) handleNav('announcements');
              else if (lower.includes('teacher') || lower.includes('chat')) handleNav('chat');
              else if (lower.includes('dashboard') || lower.includes('stat')) handleNav('dashboard');
            }}
          />
        );

      case 'chat':
        return (
          <ChatScreen
            user={user}
            mode={chatMode}
            onBack={() => setScreen('home')}
          />
        );

      case 'group-chat':
        return (
          <ClassroomsScreen
            user={user}
            onBack={() => setScreen('home')}
            onOpen={classroom => {
              setSelectedClassroom(classroom);
              setChatMode('group');
              setScreen('classroom-chat');
            }}
          />
        );

      case 'classroom-chat':
        return (
          <ChatScreen
            user={user}
            mode="group"
            classroom={selectedClassroom}
            onBack={() => setScreen('group-chat')}
          />
        );

      case 'content':
        return <ContentScreen user={user} onBack={() => setScreen('home')} />;

      case 'homework':
        return <HomeworkScreen user={user} onBack={() => setScreen('home')} />;

      case 'calendar':
        return <CalendarScreen user={user} onBack={() => setScreen('home')} />;

      case 'dashboard':
        return <DashboardScreen user={user} onBack={() => setScreen('home')} />;

      case 'announcements':
        return <AnnouncementsScreen user={user} onBack={() => setScreen('home')} />;

      default:
        return (
          <HomeScreen
            user={user}
            onNav={handleNav}
            onSendMessage={() => {}}
          />
        );
    }
  };

  return (
    <AppShell
      user={user}
      current={screen}
      onNav={handleNav}
      onLogout={handleLogout}
      dark={dark}
      onToggleTheme={() => setDark(value => !value)}
    >
      {renderScreen()}
    </AppShell>
  );
}

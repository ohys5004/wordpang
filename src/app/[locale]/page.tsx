'use client';

import { useEffect, useState } from 'react';
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Canvas from "@/components/Canvas";
import DetailPanel from "@/components/DetailPanel";
import AuthModal from "@/components/AuthModal";
import { useStore } from '@/store/useStore';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export default function Home() {
  const { usageCount } = useStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (usageCount >= 5 && !user) {
      setIsAuthOpen(true);
    }
  }, [usageCount, user]);

  return (
    <div className="relative min-h-screen">
      <Header user={user} onLoginClick={() => setIsAuthOpen(true)} />
      <div className="flex flex-col md:flex-row">
        {!isMobile && (
          <>
            <Canvas />
            <DetailPanel />
          </>
        )}
        <Sidebar fullScreen={isMobile} />
      </div>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}

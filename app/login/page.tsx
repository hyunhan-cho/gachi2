'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import type React from 'react';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const role = searchParams.get('role') || 'senior'; // Default to senior

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Add actual login logic here
        console.log('Login attempt for role:', role);
        // After successful login, redirect based on role
        if (role === 'senior') {
            router.push('/senior/select-team');
        } else {
            router.push('/helper/dashboard');
        }
    };

    return (
        <div className="flex items-center justify-center py-12">
            <Card className="w-full max-w-lg shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl text-brand-navy">
                        {role === 'senior' ? '어르신 팬 로그인' : '헬퍼 로그인'}
                    </CardTitle>
                    <CardDescription className="text-lg pt-2">
                        같이가요 서비스 이용을 위해 로그인해주세요.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-lg">
                                아이디 (이메일 또는 전화번호)
                            </Label>
                            <Input
                                id="email"
                                type="text"
                                placeholder="example@email.com"
                                className="h-14 text-lg px-4"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-lg">
                                비밀번호
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                className="h-14 text-lg px-4"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full btn-touch-lg bg-brand-navy hover:bg-brand-navy-light text-white"
                        >
                            로그인
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center gap-4 pt-6">
                    <p className="text-md text-gray-600">계정이 없으신가요?</p>
                    <Button
                        variant="outline"
                        className="w-full btn-touch-lg border-brand-navy text-brand-navy hover:bg-brand-sky/30 bg-white"
                    >
                        회원가입
                    </Button>
                    <Link href="#" className="text-md text-brand-navy hover:underline mt-2">
                        아이디/비밀번호 찾기
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const role = searchParams.get('role') || 'senior';

    // 1. state 변수 이름을 'username' -> 'phone'으로 변경하여 명확하게 합니다.
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // 2. 백엔드가 요구하는 'phone' 이라는 key로 데이터를 보냅니다.
                body: JSON.stringify({ phone, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // dj-rest-auth는 로그인 실패 시 non_field_errors를 포함할 수 있습니다.
                const errorMessage = data.non_field_errors?.[0] || '아이디 또는 비밀번호가 일치하지 않습니다.';
                throw new Error(errorMessage);
            }

            // 3. 로그인 성공 시, 토큰을 localStorage에 저장합니다.
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);

            // 4. 역할에 따라 다음 페이지로 이동합니다.
            if (role === 'senior') {
                router.push('/senior/select-team');
            } else {
                router.push('/helper/dashboard');
            }

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setIsLoading(false);
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
                            {/* 5. label과 input의 id, value, onChange를 phone state에 맞게 수정 */}
                            <Label htmlFor="phone" className="text-lg">
                                아이디 (전화번호)
                            </Label>
                            <Input
                                id="phone"
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="010-1234-5678"
                                className="h-14 text-lg px-4"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-lg">
                                비밀번호
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                className="h-14 text-lg px-4"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        
                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                        <Button
                            type="submit"
                            className="w-full btn-touch-lg bg-brand-navy hover:bg-brand-navy-light text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? '로그인 중...' : '로그인'}
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
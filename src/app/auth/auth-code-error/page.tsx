import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function AuthCodeErrorPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-red-100 p-3">
                            <AlertCircle className="h-8 w-8 text-red-600" aria-hidden="true" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                        Authentication Error
                    </CardTitle>
                    <CardDescription className="text-slate-600 mt-2">
                        We encountered a problem while trying to sign you in.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-sm text-slate-500 mb-4">
                        This could be due to:
                    </p>
                    <ul className="text-sm text-slate-500 list-disc list-inside text-left space-y-1 mb-6 pl-4">
                        <li>An expired or invalid login link</li>
                        <li>A canceled authorization request</li>
                        <li>A temporary service interruption</li>
                    </ul>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button asChild className="w-full">
                        <Link href="/login">Return to Log In</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

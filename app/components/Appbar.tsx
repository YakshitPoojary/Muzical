"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Appbar(){
    const session = useSession();

    return  <div>
        <div className="flex justify-between px-20 pt-4">
            <div className="text-lg font-bold flex flex-col justify-center text-white">
                Muzical
            </div>
            <div>
                {session.data?.user && <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={() => signOut()}>LogOut</Button>}
                {!session.data?.user &&<Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={() => signIn()}>SignIn</Button>}
            </div>
        </div>
    </div>
}
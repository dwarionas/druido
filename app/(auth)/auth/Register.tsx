
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ReloadIcon } from "@radix-ui/react-icons"

import { signup } from "../actions"

export function RegForm() {

  return (
    <form>
        <Card className="mx-auto max-w-sm"> 
            <CardHeader>
                <CardTitle className="text-2xl">Register</CardTitle>
                <CardDescription>
                Enter your data below to create new account
                </CardDescription>
            </CardHeader>
            
            <CardContent>
                <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                    id="username"
                    type="username"
                    name="username"
                    required
                    />
                </div>

                <div className="grid gap-2">
                    <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    </div>
                    <Input id="password" type="password" name="password" required />
                </div>

                <div className="grid gap-2">
                    <div className="flex items-center">
                    <Label htmlFor="password_c">Password confirmation</Label>
                    </div>
                    <Input id="password_c" type="password" name="password_c" required />
                </div>

                <Button type="submit" className="w-full" formAction={signup}>
                    Sign up
                </Button>
                </div>
            </CardContent>
        </Card>
    </form>
  )
}

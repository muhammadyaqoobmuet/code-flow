import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { User, Edit3, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';

export function CreateRoomForm() {
    const navigate = useNavigate();


    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleGenerateId = () => {
        const newId = uuidv4(); // Generate a random ID
        form.setValue('roomId', newId);
    };





    const form = useForm({
        defaultValues: {
            username: "",
            roomId: "",
        },
    });

    const onSubmit = async (values) => {
        if (!values.username || values.username.length < 2) return;
        if (!values.roomId || values.roomId.length < 3) return;

        setIsSubmitting(true);

        localStorage.setItem("codeflow_username", values.username);

        navigate(`/editor/${values.roomId}`, {
            state: {
                username: values.username,
            }
        });

        setIsSubmitting(false);
    };

    return (
        <Card className="w-full max-w-md shadow-soft-lg">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Edit3 className="h-6 w-6 text-primary" /> Create a New Room
                </CardTitle>
                <CardDescription>
                    Enter your username and a name for your new collaborative room.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Enter your username" {...field} className="pl-10" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="roomId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Room Id</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input  {...field}
                                                value={form.watch("roomId")}
                                                disabled
                                                placeholder="auto-generated-id"
                                                className="pl-10 text-black" />
                                            <Button onClick={handleGenerateId} size='sm' variant="ghost" className="absolute right-0 hover:bg-gray-100 hover:border-l-2 top-1/2 -translate-y-1/2">
                                                Generate Id
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Creating Room..." : "Create & Join Room"}
                            {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

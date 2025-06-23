
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, KeyRound, ArrowRight } from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";

// Mock room existence check
const MOCK_EXISTING_ROOM_IDS = ["project-phoenix-meeting-abc123", "study-group-xyz789"];

export function JoinRoomForm() {
    const router = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            username: "",
            roomId: "",
        },
    });

    async function onSubmit(values) {
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Store username in localStorage
        localStorage.setItem('codeflow_username', values.username);

        // Validate inputs
        if (!values.username || values.username.length < 2) {
            toast.error(
                "Invalid Username",
            )
            setIsSubmitting(false);
            return;
        }

        if (!values.roomId || values.roomId.length < 3) {
            toast.error(`The room with ID "${values.roomId}" does not exist. Please check the ID and try again.`);
            setIsSubmitting(false);
            return;
        }

        // Mock room existence check
        if (!MOCK_EXISTING_ROOM_IDS.includes(values.roomId) && !values.roomId.includes('-')) {
            toast.success(`Attempting to join room "${values.roomId}".`);
            setIsSubmitting(false);
            return;
        }

        toast.success(
            "Joining Room...",

        );

        router(`/editor/${values.roomId}`, {
            state: {
                username: values.username
            }
        });


        setIsSubmitting(false);

    }

    return (
        <Card className="w-full max-w-md shadow-soft-lg">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <KeyRound className="h-6 w-6 text-primary" /> Join an Existing Room
                </CardTitle>
                <CardDescription>Enter your username and the ID of the room you want to join.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Enter your username"
                                className="pl-10"
                                {...register("username", {
                                    required: true,
                                    minLength: 2,
                                    maxLength: 50
                                })}
                            />
                        </div>
                        {errors.username && (
                            <p className="text-sm font-medium text-destructive">
                                {errors.username.type === "required" && "Username is required"}
                                {errors.username.type === "minLength" && "Username must be at least 2 characters"}
                                {errors.username.type === "maxLength" && "Username too long"}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Room ID</label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Enter Room ID"
                                className="pl-10"
                                {...register("roomId", {
                                    required: true,
                                    minLength: 3,
                                    maxLength: 60
                                })}
                            />
                        </div>
                        {errors.roomId && (
                            <p className="text-sm font-medium text-destructive">
                                {errors.roomId.type === "required" && "Room ID is required"}
                                {errors.roomId.type === "minLength" && "Room ID must be at least 3 characters"}
                                {errors.roomId.type === "maxLength" && "Room ID too long"}
                            </p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Joining..." : "Join Room"}
                        {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
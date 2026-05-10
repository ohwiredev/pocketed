import { Bell, LogOut, Palette } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { session, signOut, updateProfile } = useAuth();
  const user = session?.user;
  const currentDisplayName =
    session?.user?.user_metadata?.display_name ||
    session?.user?.email?.split("@")[0];

  const [displayName, setDisplayName] = useState(currentDisplayName);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  const initials = currentDisplayName
    ? currentDisplayName.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || "??";

  const handleUpdateProfile = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage("");

    const { error } = await updateProfile({ displayName });

    if (error) {
      setUpdateMessage("Failed to update profile.");
    } else {
      setUpdateMessage("Profile updated successfully!");
    }
    setIsUpdating(false);
  };

  return (
    <>
      <main className="container mx-auto max-w-3xl px-4 pt-8 md:px-8">
        <h1 className="mb-8 font-serif text-3xl font-bold tracking-tight md:text-4xl">
          Profile Settings
        </h1>

        <div className="space-y-6">
          {/* Identity Block */}
          <Card>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">
                    {currentDisplayName || "User"}
                  </h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Block */}
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>
                Update your public profile information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                    className="max-w-md text-sm"
                  />
                </div>
                {updateMessage && (
                  <p
                    className={`text-sm ${updateMessage.includes("success") ? "text-green-500" : "text-destructive"}`}
                  >
                    {updateMessage}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={isUpdating || displayName === currentDisplayName}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preferences Block (Placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your Pocketed experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Appearance</p>
                    <p className="text-sm text-muted-foreground">
                      Light, dark, or system default
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Manage email alerts
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Log out of your account on this device.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={signOut}
                className="gap-2 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

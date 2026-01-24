"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getUserById,
  resetPasswordByUsername,
  updateUser,
} from "@/lib/services/userService";
import { toast } from "sonner";
export function EditUserModal({
  onClose,
  userId,
}: {
  onClose: () => void;
  userId: number;
}) {
  const [user, setUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchingUser = async () => {
      setLoading(true);
      try {
        const fetchedUser = await getUserById(userId);
        setUser(fetchedUser);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchingUser();
  }, []);
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPasswordByUsername(user.user_id, newPassword);
      setLoading(false);
      onClose();
      toast.success("User updated successfully ✅");
    } catch (error) {
      console.log("Error at updating a user:", error);
    }
  };
  return (
    <form onClick={handleEditUser}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {user ? `Edit User: ${user.username}` : "Edit User"}
          </DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              readOnly
              defaultValue={user ? user.username : ""}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="name-1">New Password</Label>
            <Input
              name="password"
              type="password"
              value={newPassword}
              placeholder="Enter a new password here"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </form>
  );
}

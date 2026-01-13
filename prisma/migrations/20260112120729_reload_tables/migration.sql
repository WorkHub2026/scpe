-- AlterTable
ALTER TABLE "PasswordResetRequest" ADD COLUMN     "reviewedBy" INTEGER;

-- AddForeignKey
ALTER TABLE "PasswordResetRequest" ADD CONSTRAINT "PasswordResetRequest_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

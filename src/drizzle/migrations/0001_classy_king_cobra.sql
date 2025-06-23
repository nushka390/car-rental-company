ALTER TABLE "customer" ADD COLUMN "Password" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "Role" varchar(20) DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "isVerified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "verificationCode" varchar(6);
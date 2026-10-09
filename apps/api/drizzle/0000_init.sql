CREATE TABLE "checkins" (
	"habit_id" uuid NOT NULL,
	"date" date NOT NULL,
	CONSTRAINT "checkins_habit_id_date_pk" PRIMARY KEY("habit_id","date")
);
--> statement-breakpoint
CREATE TABLE "habits" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"active_days" smallint[] NOT NULL,
	"week_goal" smallint NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "checkins" ADD CONSTRAINT "checkins_habit_id_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."habits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "checkins_date_index" ON "checkins" USING btree ("date");
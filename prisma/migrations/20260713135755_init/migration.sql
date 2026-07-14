-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "image" TEXT,
    "province" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AcademicResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "yearCompleted" INTEGER NOT NULL,
    "province" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AcademicResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubjectGrade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academicResultId" TEXT NOT NULL,
    "subjectName" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "symbol" TEXT,
    "percentage" INTEGER,
    CONSTRAINT "SubjectGrade_academicResultId_fkey" FOREIGN KEY ("academicResultId") REFERENCES "AcademicResult" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "website" TEXT,
    "description" TEXT,
    "ranking" INTEGER,
    "type" TEXT NOT NULL DEFAULT 'public',
    "founded" INTEGER,
    "students" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "universityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "code" TEXT,
    "qualification" TEXT NOT NULL,
    "durationYears" INTEGER NOT NULL,
    "apsMin" INTEGER,
    "description" TEXT,
    "careerPaths" TEXT,
    "annualCost" INTEGER,
    "faculty" TEXT,
    "mode" TEXT NOT NULL DEFAULT 'full-time',
    "nqfLevel" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Course_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CourseRequirement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "minLevel" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "CourseRequirement_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CareerPath" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "avgSalaryMin" INTEGER,
    "avgSalaryMax" INTEGER,
    "demandLevel" TEXT,
    "growthRate" TEXT,
    "workLife" TEXT,
    "keySkills" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CareerCourse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "careerPathId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    CONSTRAINT "CareerCourse_careerPathId_fkey" FOREIGN KEY ("careerPathId") REFERENCES "CareerPath" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CareerCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Accommodation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "universityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "priceMin" INTEGER,
    "priceMax" INTEGER,
    "amenities" TEXT,
    "distanceKm" REAL,
    "description" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Accommodation_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SafetyData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "universityId" TEXT NOT NULL,
    "areaName" TEXT NOT NULL,
    "safetyScore" INTEGER NOT NULL,
    "crimeRate" TEXT,
    "wellLitStreets" BOOLEAN,
    "campusSecurity" BOOLEAN,
    "nearbyPolice" BOOLEAN,
    "emergencyContacts" TEXT,
    "details" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SafetyData_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "universityId" TEXT,
    "accommodationId" TEXT,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "category" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "Accommodation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SavedItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT,
    "careerPathId" TEXT,
    "accommodationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SavedItem_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SavedItem_careerPathId_fkey" FOREIGN KEY ("careerPathId") REFERENCES "CareerPath" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SavedItem_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "Accommodation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "AcademicResult_userId_idx" ON "AcademicResult"("userId");

-- CreateIndex
CREATE INDEX "SubjectGrade_academicResultId_idx" ON "SubjectGrade"("academicResultId");

-- CreateIndex
CREATE INDEX "SubjectGrade_subjectName_idx" ON "SubjectGrade"("subjectName");

-- CreateIndex
CREATE UNIQUE INDEX "University_slug_key" ON "University"("slug");

-- CreateIndex
CREATE INDEX "University_slug_idx" ON "University"("slug");

-- CreateIndex
CREATE INDEX "University_province_idx" ON "University"("province");

-- CreateIndex
CREATE INDEX "Course_universityId_idx" ON "Course"("universityId");

-- CreateIndex
CREATE INDEX "Course_name_idx" ON "Course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Course_universityId_slug_key" ON "Course"("universityId", "slug");

-- CreateIndex
CREATE INDEX "CourseRequirement_courseId_idx" ON "CourseRequirement"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "CareerPath_slug_key" ON "CareerPath"("slug");

-- CreateIndex
CREATE INDEX "CareerPath_slug_idx" ON "CareerPath"("slug");

-- CreateIndex
CREATE INDEX "CareerPath_category_idx" ON "CareerPath"("category");

-- CreateIndex
CREATE INDEX "CareerCourse_careerPathId_idx" ON "CareerCourse"("careerPathId");

-- CreateIndex
CREATE INDEX "CareerCourse_courseId_idx" ON "CareerCourse"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "CareerCourse_careerPathId_courseId_key" ON "CareerCourse"("careerPathId", "courseId");

-- CreateIndex
CREATE INDEX "Accommodation_universityId_idx" ON "Accommodation"("universityId");

-- CreateIndex
CREATE INDEX "Accommodation_priceMin_idx" ON "Accommodation"("priceMin");

-- CreateIndex
CREATE UNIQUE INDEX "SafetyData_universityId_areaName_key" ON "SafetyData"("universityId", "areaName");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_universityId_idx" ON "Review"("universityId");

-- CreateIndex
CREATE INDEX "Review_accommodationId_idx" ON "Review"("accommodationId");

-- CreateIndex
CREATE INDEX "SavedItem_userId_idx" ON "SavedItem"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedItem_userId_courseId_careerPathId_accommodationId_key" ON "SavedItem"("userId", "courseId", "careerPathId", "accommodationId");

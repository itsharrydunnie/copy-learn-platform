# Pacepard Project Overview

### Helping African talents unlock their superhuman potential.

> Pacepard is a backend API for a learning and talent development platform. It provides the core services needed to manage learning programs, courses, events, scholarships, enrollments, and payments.

This document gives a quick overview of what is being built and how the main modules work together.

## The Learning Structure

The platform is built around learning experiences:

```
Programs
   └── Events

Courses
   └── Modules
```

Users can discover these learning opportunities, enroll in courses, apply for scholarships where available, and complete payments to gain access.

## Programs

Programs represent learning initiatives on the platform.

They provide a way to organize and present learning experiences and can contain events.

Programs move through their lifecycle and can be published when they are ready for users.

## Events

Events belong to programs and represent individual learning sessions or activities.

They can be created and managed independently while remaining connected to their parent program.

## Courses

Courses are structured learning experiences offered on the platform.

A course contains its own details, pricing, scholarship pricing where applicable, and the information needed to support enrollment and payment.

## Modules

Modules are the individual learning units inside a course.

They represent the sessions or content that make up a course. Recordings can be added after a module has been completed.

## Enrollments

Enrollments track a user's relationship with a course.

An enrollment begins when a user starts joining a course and becomes active when the required payment has been successfully confirmed.

## Scholarships

The scholarship module allows users to apply for discounted access to eligible courses.

Applications are created and processed through the platform's background job system. Once approved, the platform prepares the enrollment and payment journey for the user.

## Transactions and Payments

Transactions track course payments and their lifecycle.

The payment flow creates and manages pending transactions, receives payment updates from Paystack, and updates the corresponding enrollment when payment succeeds or fails.

## Emails and Background Jobs

Some operations happen outside the normal API request lifecycle.

Redis and Bull queues are used to process background work such as scholarship processing and email delivery. Workers consume these jobs and perform the required actions without making users wait for long-running operations.

## The Main User Journey

A typical journey through the platform looks like this:

```
Discover a Program or Course
          ↓
Explore the Learning Opportunity
          ↓
Enroll or Apply for a Scholarship
          ↓
Complete Payment
          ↓
Payment Confirmed
          ↓
Enrollment Activated
          ↓
Begin Learning
```

Pacepard brings these modules together to provide the backend foundation for managing the complete learning journey.

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Root app router pages
import SignInPage from '../app/page';
import SignUpPage from '../app/sign-up/page';
import ForgotPasswordPage from '../app/forgot-password/page';
import ResetPasswordPage from '../app/reset-password/page';
import VerifyEmailPage from '../app/verify-email/page';
import VerifyOtpPage from '../app/verify-otp/page';
import EmailVerifiedPage from '../app/email-verified/page';

import DashboardPage from '../app/dashboard/page';
import UploadsPage from '../app/uploads/page';
import UploadPage from '../app/upload/page';
import CoursesPage from '../app/courses/page';
import AssignmentsPage from '../app/assignments/page';
import GradesPage from '../app/grades/page';
import TimetablePage from '../app/timetable/page';
import HocHubPage from '../app/hoc-hub/page';
import RewardsPage from '../app/rewards/page';
import AccountPage from '../app/account/page';

import AddRecoveryEmailPage from '../app/account/add-recovery-email/page';
import VerifyRecoveryEmailPage from '../app/account/verify-recovery-email/page';
import RecoveryEmailVerifiedPage from '../app/account/recovery-email-verified/page';
import RecoveryEmailFailedPage from '../app/account/recovery-email-failed/page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<SignInPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/email-verified" element={<EmailVerifiedPage />} />

        {/* Scholar Portal Main Pages */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/uploads" element={<UploadsPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/grades" element={<GradesPage />} />
        <Route path="/timetable" element={<TimetablePage />} />
        <Route path="/hoc-hub" element={<HocHubPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/account" element={<AccountPage />} />

        {/* Recovery Email Flow */}
        <Route path="/account/add-recovery-email" element={<AddRecoveryEmailPage />} />
        <Route path="/account/verify-recovery-email" element={<VerifyRecoveryEmailPage />} />
        <Route path="/account/recovery-email-verified" element={<RecoveryEmailVerifiedPage />} />
        <Route path="/account/recovery-email-failed" element={<RecoveryEmailFailedPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

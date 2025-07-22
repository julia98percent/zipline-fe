import React from "react";
import { Link } from "react-router-dom";

interface AuthLinkProps {
  to: string;
  children: React.ReactNode;
}

const AuthLink = ({ to, children }: AuthLinkProps) => (
  <Link
    to={to}
    className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
  >
    {children}
  </Link>
);

const Divider = () => <div className="w-px h-4 bg-gray-300" />;

const AuthLinks = () => (
  <div className="flex justify-center items-center mt-6 gap-3">
    <AuthLink to="/find-account?tab=id">아이디 찾기</AuthLink>
    <Divider />
    <AuthLink to="/find-account?tab=password">비밀번호 찾기</AuthLink>
    <Divider />
    <AuthLink to="/sign-up">회원가입</AuthLink>
  </div>
);

export default AuthLinks;

export default function AuthErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <div className="text-danger text-sm text-center">{message}</div>;
}

import { redirect } from "next/navigation";

export default function RotaIndexPage() {
  const now = new Date();
  redirect(`/rota/${now.getFullYear()}/${now.getMonth() + 1}`);
}

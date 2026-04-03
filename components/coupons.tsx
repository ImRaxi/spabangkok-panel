import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconBell } from "@/components/panel-icons";
import { PanelSidebar } from "@/components/panel-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Coupons() {
  return (
    <div className="flex h-screen bg-background">
      <PanelSidebar activeHref="/coupons" />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="h-14 border-b bg-card px-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Kupony</h1>

          <div className="flex items-center gap-4">

            <Button variant="outline" size="icon" aria-label="Powiadomienia">
              <IconBell />
            </Button>

            <ThemeToggle />

            <Avatar className="cursor-pointer">
              <AvatarImage src="https://i.pravatar.cc/128" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto flex max-w-2xl flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sprawdź kupon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Wpisz kod kuponu" />
                <Button type="button" className="w-full">
                  Sprawdź
                </Button>
                <p className="text-sm text-muted-foreground">
                  Podstawowa wartość vouchera to: 0 zł
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Zostaw komentarz do vouchera:
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">
                  Jeśli nie chcesz wykorzystać całego vouchera, napisz odpowiedni
                  komentarz sugerujący dla kolejnej osoby jaka suma z vouchera
                  została wykorzystana oraz ile jeszcze pozostało do
                  wykorzystania.
                </CardDescription>
                <Textarea
                  placeholder="Komentarz..."
                  rows={6}
                  className="min-h-40 resize-y"
                />
                <Button type="button" className="w-full">
                  Zaktualizuj
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

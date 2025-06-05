import { Button } from "@/_ui/shadcn/button";
import { Sheet, SheetContent, SheetTrigger } from "@/_ui/shadcn/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./Logo";
import { NavMenu } from "./NavMenu";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-4">
        <Logo />
        <div className="flex-1">
          <NavMenu orientation="vertical" className="mt-12" />
        </div>

        {/* <div className="mt-8 space-y-4">
          <Button variant="outline" className="w-full sm:hidden">
            Sign In
          </Button>
          <Button className="w-full xs:hidden">Get Started</Button>
        </div> */}
      </SheetContent>
    </Sheet>
  );
};

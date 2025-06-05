import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/_ui/shadcn/navigation-menu";
import { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import Link from "next/link";

export const NavMenu = (props: NavigationMenuProps) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link href="/books">Books</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link href="/authors">Authors</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);

import { Corazon } from "@/components/decor/Corazon";
import { Flor } from "@/components/decor/Flor";
import { Mariposa } from "@/components/decor/Mariposa";
import { Ola } from "@/components/decor/Ola";
import { Rama } from "@/components/decor/Rama";

type DecorProps = {
  variant: "flor" | "rama" | "corazon" | "mariposa" | "ola";
  className?: string;
};

export function Decor({ variant, className }: DecorProps) {
  switch (variant) {
    case "flor":
      return <Flor className={className} />;
    case "rama":
      return <Rama className={className} />;
    case "corazon":
      return <Corazon className={className} />;
    case "mariposa":
      return <Mariposa className={className} />;
    case "ola":
      return <Ola className={className} />;
  }
}

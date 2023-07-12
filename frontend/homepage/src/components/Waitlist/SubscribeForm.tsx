import {
  Stack,
  Text,
  FormControl,
  Input,
  Button,
  StackProps,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useState, FormEvent, ChangeEvent } from "react";
import { colors } from "@/theme/colors";
import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_PROJECT;
const SUPABASE_API = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;
const supabase = createClient(SUPABASE_URL!, SUPABASE_API!);

interface Props extends StackProps {}

export default function SubscribeForm({ ...props }: Props) {
  const [state, setState] = useState<"initial" | "submitting" | "success">(
    "initial"
  );
  const [error, setError] = useState(false);
  const [email, setEmail] = useState<string>();

  const onSubscribeClick = async (e: any) => {};
  return (
    <>
      <Stack
        {...props}
        direction={{ base: "column", md: "row" }}
        as={"form"}
        spacing={"12px"}
        onSubmit={async (e: FormEvent) => {
          e.preventDefault();
          setError(false);
          setState("submitting");

          if (email) {
            // check if email already exist on waitlist
            let { data: waitlist, error } = await supabase
              .from("waitlist")
              .select("email")
              .eq("email", email);

            if (waitlist && waitlist?.length > 0) {
              // email exist
              console.log("ALREADY ON THE WAITLIST");
              setState("success");
            } else {
              console.log("adding email");
              const { data, error } = await supabase
                .from("waitlist")
                .insert([{ email }])
                .select();

              if (!error) {
                console.log("DATA", data);
                setState("success");
              } else {
                console.log("ERROR", error);
                setError(true);
                setState("initial");
              }
            }
          }
        }}
      >
        <FormControl>
          <Input
            h="64px"
            variant={"solid"}
            borderWidth={"3px"}
            borderColor={colors.white}
            borderStyle={"solid"}
            borderRadius={"16px"}
            id={"email"}
            type={"email"}
            required
            placeholder={"Your Email"}
            aria-label={"Your Email"}
            value={email}
            disabled={state !== "initial"}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            bg={colors.brandBlue}
          />
        </FormControl>
        <FormControl w={{ base: "100%", md: "25%" }}>
          <Button
            padding={"22px 32px"}
            height={"64px"}
            bg={colors.white}
            borderWidth={"3px"}
            borderColor={colors.white}
            borderStyle={"solid"}
            borderRadius={"16px"}
            colorScheme={state === "success" ? "green" : "blue"}
            color={colors.brandBlack}
            isLoading={state === "submitting"}
            w="100%"
            type={state === "success" ? "button" : "submit"}
            _hover={{
              color: "white",
              bg: colors.brandBlue,
            }}
          >
            {state === "success" ? <CheckIcon /> : "Join"}
          </Button>
        </FormControl>
      </Stack>
    </>
  );
}

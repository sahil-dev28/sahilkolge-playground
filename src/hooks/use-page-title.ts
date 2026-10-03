import { useEffect } from "react";

export const HOME_TITLE = "Sahil Kolge · Full Stack Developer";

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

type NotifierParams = {
  show: boolean;
  content?: string;
  color?: string;
  error?: unknown;
};

const notification = reactive<NotifierParams>({
  show: false,
});

export const useNotifier = () => {
  const notifier = ({
    content,
    color,
    error,
  }: Omit<NotifierParams, "show">) => {
    const hasError = Boolean(error);
    notification.color = color || (hasError ? "error" : "info");

    let resolvedContent = content;
    if (!resolvedContent && typeof error === "string") {
      resolvedContent = error;
    } else if (!resolvedContent && error instanceof Error) {
      resolvedContent = error.message;
    }

    notification.content = resolvedContent || "Une erreur est survenue";
    notification.show = true;

    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return { notification, notifier };
};

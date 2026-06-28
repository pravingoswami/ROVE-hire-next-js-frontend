type MeetLinkProps = {
  url: string;
  /** Compact table cell style vs inline on detail pages */
  variant?: "button" | "link";
};

export function MeetLink({ url, variant = "link" }: MeetLinkProps) {
  if (variant === "button") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-secondary btn-sm"
        style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
      >
        Join Meet
      </a>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem" }}>
      Google Meet
    </a>
  );
}

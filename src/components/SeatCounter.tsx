type SeatCounterProps = {
  seatCap: number;
  remaining: number;
  className?: string;
};

/** Visual seats-left indicator: one dot per seat, lit for what's still open. */
export function SeatCounter({ seatCap, remaining, className = "" }: SeatCounterProps) {
  const booked = seatCap - remaining;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex gap-1" aria-hidden="true">
        {Array.from({ length: seatCap }, (_, i) => (
          <span
            key={i}
            className={`h-2.5 w-2.5 rounded-full ${
              i < booked ? "bg-almond" : "bg-chilli"
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-ink-soft">
        {remaining > 0
          ? `${remaining} of ${seatCap} seats left`
          : "Fully booked"}
      </span>
    </div>
  );
}

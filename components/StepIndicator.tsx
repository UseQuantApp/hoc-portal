export default function StepIndicator({
  step,
  className = "",
}: {
  step: number;
  className?: string;
}) {
  const totalSteps = 2;

  return (
    <div className={`max-w-[393px] flex justify-center gap-1.5 ${className}`}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-1 w-12 rounded-full ${i === step - 1 ? "bg-[#006dff]" : "bg-[#dbdbdb]"}`}
        />
      ))}
    </div>
  );
}

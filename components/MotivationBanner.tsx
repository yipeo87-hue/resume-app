interface Props {
  text: string;
}

export default function MotivationBanner({ text }: Props) {
  return (
    <div className="rounded-xl bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border border-amber-200 p-6 text-center">
      <p className="text-2xl mb-3">🌈</p>
      <p className="text-gray-700 leading-relaxed italic">"{text}"</p>
    </div>
  );
}

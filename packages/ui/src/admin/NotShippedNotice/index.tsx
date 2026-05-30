import { Mono } from '../../components/Typography';

interface Props {
  /** Backend endpoint(s) that this page would consume once shipped. */
  endpoints: string[];
  /**
   * Optional plain-language note. Default explains that the page is showing
   * mock data and any mutations will fail with 404 until the back-end ships.
   */
  note?: React.ReactNode;
}

/**
 * Banner for admin pages whose backend endpoint(s) are NOT yet in
 * `lockin90-backend/API_REFERENCE.md` Appendix A. The page renders mock data so
 * operators can still navigate the UI, but mutations route to deleted Next.js
 * proxies and fail with 404. The notice makes the situation explicit instead
 * of letting the operator discover it via a generic error toast.
 */
export default function NotShippedNotice({ endpoints, note }: Props) {
  return (
    <div
      role="status"
      className="bg-amber-zone/10 border border-amber-zone/40 rounded px-4 py-3 mb-5 flex items-start gap-3"
    >
      <span className="font-display italic font-bold text-[10px] tracking-[0.12em] uppercase text-amber-zone shrink-0 mt-1">
        BACKEND NOT SHIPPED
      </span>
      <div className="text-[12px] text-secondary leading-relaxed">
        {note ?? (
          <>
            This page is rendering <span className="text-white">mock data</span>. The Fastify
            back-end has not shipped the endpoints below yet, so any action will return{' '}
            <Mono color="white">404</Mono>.
          </>
        )}
        <ul className="mt-1 flex flex-col gap-0.5">
          {endpoints.map((e) => (
            <li key={e}>
              <Mono color="white">{e}</Mono>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

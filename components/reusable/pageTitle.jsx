"use client";

export default function PageTitle({ title, desc }) {
    return (
        <div className="mb-5">
            <h1 className="text-md text-[var(--textgraybold)]">
                {title}
            </h1>
            <p className="text-sm text-[var(--textgray)]">{desc}</p>
        </div>
    );
}
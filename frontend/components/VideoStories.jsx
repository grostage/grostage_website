const videos = [
  {
    id: 'ciaIy8TD8HQ',
    client: 'FRUITUP',
    title: 'FruitUp Client Review',
    iframeTitle: 'FruitUp Client Review Grostage',
    src: 'https://www.youtube.com/embed/ciaIy8TD8HQ',
  },
  {
    id: 'dxEVUtyKtHY',
    client: 'DATACORREL',
    title: 'DataCorrel Client Testimonial',
    iframeTitle: 'DataCorrel Client Testimonial Grostage',
    src: 'https://www.youtube.com/embed/dxEVUtyKtHY',
  },
];

export default function VideoStories() {
  return (
    <div className="video-grid">
      {videos.map((v) => (
        <article key={v.id}>
          <div className="video-frame">
            <iframe
              width="357"
              height="635"
              src={v.src}
              title={v.iframeTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
              allowFullScreen
            />
          </div>
          <p className="eyebrow">{v.client}</p>
          <h3>{v.title}</h3>
        </article>
      ))}
    </div>
  );
}

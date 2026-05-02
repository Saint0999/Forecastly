const S = ({ className = '', style = {} }) => (
  <div className={`skeleton ${className}`} style={style} />
);

export function SkeletonCurrentWeather() {
  return (
    <div className="skeleton-card skeleton-current">
      <div className="sk-left">
        <S className="sk-line xl" style={{ width: '110px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <S className="sk-circle" style={{ width: '36px', height: '36px' }} />
          <S className="sk-line" style={{ width: '70px' }} />
        </div>
        <S className="sk-line sm" style={{ width: '120px' }} />
      </div>
      <div className="sk-right">
        <S className="sk-line lg" style={{ width: '80px' }} />
        <S className="sk-line sm" style={{ width: '60px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <S className="sk-circle" style={{ width: '26px', height: '26px' }} />
          <S className="sk-line" style={{ width: '50px' }} />
        </div>
        <S className="sk-line sm" style={{ width: '90px' }} />
      </div>
    </div>
  );
}

export function SkeletonHourlyForecast({ count = 8 }) {
  return (
    <div className="skeleton-hourly-wrap">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-hour-card">
          <S className="sk-line sm" style={{ width: '36px' }} />
          <S className="sk-circle" style={{ width: '32px', height: '32px' }} />
          <S className="sk-line" style={{ width: '28px' }} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonForecastRow() {
  return (
    <div className="skeleton-card skeleton-forecast-row">
      <S className="sk-line" style={{ flex: 1, maxWidth: '160px' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '110px', justifyContent: 'center' }}>
        <S className="sk-circle" style={{ width: '36px', height: '36px' }} />
        <S className="sk-line" style={{ width: '42px' }} />
      </div>
      <S className="sk-line" style={{ width: '90px', textAlign: 'right' }} />
    </div>
  );
}

export function SkeletonDailyForecast({ count = 5 }) {
  return (
    <div className="daily-forecast">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonForecastRow key={i} />
      ))}
    </div>
  );
}

export function SkeletonCityCard() {
  return (
    <div className="skeleton-card skeleton-city">
      <div className="sk-left">
        <S className="sk-line xl" style={{ width: '90px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <S className="sk-circle" style={{ width: '32px', height: '32px' }} />
          <S className="sk-line" style={{ width: '60px' }} />
        </div>
        <S className="sk-line sm" style={{ width: '110px' }} />
      </div>
      <div className="sk-right">
        <S className="sk-line lg" style={{ width: '70px' }} />
        <S className="sk-line sm" style={{ width: '55px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <S className="sk-circle" style={{ width: '22px', height: '22px' }} />
          <S className="sk-line" style={{ width: '44px' }} />
        </div>
        <S className="sk-line sm" style={{ width: '80px' }} />
      </div>
    </div>
  );
}

export function SkeletonOtherCities({ count = 4 }) {
  return (
    <div className="other-cities">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCityCard key={i} />
      ))}
    </div>
  );
}
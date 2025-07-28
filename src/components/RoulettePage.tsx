'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/types';
import { Button } from '@/components/ui/button';
import { trackEvent } from 'fathom-client';
import Link from 'next/link';

interface RoulettePageProps {
  icons: Icon[];
}

export default function RoulettePage({ icons }: RoulettePageProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIcons, setSelectedIcons] = useState<Icon[]>([]);
  const [displayIcons, setDisplayIcons] = useState<Icon[]>([]);
  const [resultMessage, setResultMessage] = useState<string>('');

  // Track page view on mount
  useEffect(() => {
    trackEvent('ROULETTE_PAGE_VIEWED');
  }, []);

  const getResultMessage = (cities: Icon[]) => {
    const cityNames = cities.map(icon => icon.city);
    const uniqueCities = [...new Set(cityNames)];
    
    if (uniqueCities.length === 1) {
      return `No doubt — you have to go to ${uniqueCities[0]}.`;
    } else if (uniqueCities.length === 2) {
      const duplicates = cityNames.filter((city, index) => cityNames.indexOf(city) !== index);
      const uniqueCity = uniqueCities.find(city => city !== duplicates[0]);
      return `Looks like the universe is hinting at ${duplicates[0]}. Time to book that trip.`;
    } else {
      return "Three solid picks. You've got options.";
    }
  };

  const getDuplicateCities = (cities: Icon[]) => {
    const cityNames = cities.map(icon => icon.city);
    const duplicates = cityNames.filter((city, index) => cityNames.indexOf(city) !== index);
    return duplicates;
  };

  const spinRoulette = () => {
    setIsSpinning(true);
    setResultMessage('');
    trackEvent('ROULETTE_SPIN_STARTED');

    // Generate 3 random icons with increased probability for duplicates
    const random = Math.random();
    let randomIcons: Icon[];
    
    console.log('Random value:', random); // Debug
    
    if (random < 0.05) {
      // 5% chance for triple (all same city)
      const shuffled = [...icons].sort(() => Math.random() - 0.5);
      const selectedCity = shuffled[0];
      randomIcons = [selectedCity, selectedCity, selectedCity];
      console.log('TRIPLE - All same city:', selectedCity.city); // Debug
    } else if (random < 0.25) {
      // 20% chance for double (2 same cities)
      const shuffled = [...icons].sort(() => Math.random() - 0.5);
      const selectedCity = shuffled[0];
      const otherCities = shuffled.filter(icon => icon.city !== selectedCity.city);
      const secondCity = otherCities[0];
      randomIcons = [selectedCity, selectedCity, secondCity];
      console.log('DOUBLE - Two same cities:', selectedCity.city, 'and', secondCity.city); // Debug
    } else {
      // 75% chance for all different cities
      const shuffled = [...icons].sort(() => Math.random() - 0.5);
      randomIcons = shuffled.slice(0, 3);
      console.log('THREE DIFFERENT - Cities:', randomIcons.map(icon => icon.city)); // Debug
    }
    
    setSelectedIcons(randomIcons);

    // Start the spinning animation with variable speed
    let spinCount = 0;
    const maxSpins = 40;
    const baseInterval = 150;
    const slowDownFactor = 1.5; // How much to slow down
    
    const spinInterval = setInterval(() => {
      const tempIcons = [...icons].sort(() => Math.random() - 0.5).slice(0, 3);
      setDisplayIcons(tempIcons);
      spinCount++;

      // Slow down towards the end
      if (spinCount >= maxSpins * 0.7) {
        clearInterval(spinInterval);
        // Start slower spinning for the final phase
        let finalSpinCount = 0;
        const finalSpins = 10;
        const finalInterval = setInterval(() => {
          const tempIcons = [...icons].sort(() => Math.random() - 0.5).slice(0, 3);
          setDisplayIcons(tempIcons);
          finalSpinCount++;

          if (finalSpinCount >= finalSpins) {
            clearInterval(finalInterval);
            setDisplayIcons(randomIcons);
            setIsSpinning(false);
            const message = getResultMessage(randomIcons);
            setResultMessage(message);
            
            // Track result type
            const cityNames = randomIcons.map(icon => icon.city);
            const uniqueCities = [...new Set(cityNames)];
            
            if (uniqueCities.length === 1) {
              trackEvent('ROULETTE_RESULT_SAME_CITY');
            } else if (uniqueCities.length === 2) {
              const duplicates = cityNames.filter((city, index) => cityNames.indexOf(city) !== index);
              trackEvent('ROULETTE_RESULT_DUPLICATE_CITY');
            } else {
              trackEvent('ROULETTE_RESULT_THREE_DIFFERENT');
            }
          }
        }, baseInterval * slowDownFactor);
      }
    }, baseInterval);
  };

  const duplicateCities = getDuplicateCities(displayIcons);

  // Debug: Log the current state
  console.log('Selected icons:', selectedIcons.map(icon => icon.city));
  console.log('Display icons:', displayIcons.map(icon => icon.city));
  console.log('Duplicate cities:', duplicateCities);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <Link
              href="/"
              className="text-base text-muted-foreground hover:text-orange-600 transition-colors underline"
              onClick={() => trackEvent('ROULETTE_BACK_TO_CITIES_CLICKED')}
            >
              ← Back to cities
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 mt-8">
            Where Should You Go This Year?
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Click the button to spin the globe and get your travel picks for the year.
          </p>
        </div>

        {/* Roulette Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 w-full aspect-[3/4] ${
                isSpinning 
                  ? 'border-orange-400 bg-orange-50 animate-pulse' 
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex flex-col items-center justify-center h-full">
                {displayIcons[index] ? (
                  <>
                    <div className="w-16 h-16 text-foreground mb-4">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: displayIcons[index].svgContent
                            .replace(/width="[^"]*"/, 'width="64"')
                            .replace(/height="[^"]*"/, 'height="64"')
                            .replace(/viewBox="[^"]*"/, 'viewBox="0 0 120 120"')
                        }}
                      />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${
                      !isSpinning && duplicateCities.includes(displayIcons[index].city)
                        ? 'text-orange-600'
                        : 'text-foreground'
                    }`}>
                      {displayIcons[index].city}
                    </h3>
                    <p className="text-muted-foreground">
                      {displayIcons[index].country}
                    </p>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 text-foreground mb-4">
                      {/* Cherry icon placeholder */}
                      <svg viewBox="0 0 120 120" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M87.5674 64.8959L90.2041 65.2709L90.1924 65.2826L92.7939 65.5287L93.0869 65.5521L93.3447 65.6927L95.7002 66.9467L95.7236 66.9584L95.7354 66.9701L98.0674 68.2826L98.4072 68.4818L98.6182 68.8334L99.9775 71.142L99.9893 71.1654L101.267 73.4154L101.278 73.4388L102.544 75.7943L102.673 76.0287L102.708 76.2982L103.083 78.9349L103.095 79.0873L103.083 79.2513L102.896 81.7592L103.212 84.267L103.259 84.6068L103.142 84.9349L102.274 87.4662L101.396 89.9506L101.372 90.0209L101.325 90.1029L100.188 92.4701L100.095 92.6342L98.6533 94.849L98.6064 94.9193L98.5479 94.9896L96.8486 97.017L96.8369 97.0404L96.8135 97.0638L95.0322 99.0443L94.8096 99.3021L94.4932 99.431L92.0322 100.439L91.8799 100.497L91.7275 100.533L89.2197 100.978L88.9619 101.025L88.7041 100.978L86.4072 100.603L84.1924 101.201L81.8486 102.068L81.79 102.079L81.7432 102.103L79.2588 102.806L78.9189 102.9L78.5791 102.841L75.9541 102.361L75.6846 102.302L75.4619 102.173L73.2002 100.826L70.9033 99.5482L70.7979 99.4896L70.6924 99.4076L68.665 97.7435L68.5947 97.6967L68.5361 97.6263L66.708 95.7631L66.6377 95.6927L66.5791 95.6107L65.0088 93.5131L64.9971 93.5013L63.4385 91.3802L63.3682 91.2748L63.3096 91.1576L62.126 88.7787L62.0557 88.6263L62.0205 88.4623L61.3877 85.8959L61.376 85.7904L61.3643 85.6967L61.083 83.0717L61.0596 82.9076L61.083 82.7318L61.4111 80.1302V80.0834L61.4229 80.0365L61.8916 77.4701L61.9268 77.2943L61.9854 77.142L63.0283 74.7396L63.0752 74.6107L63.1455 74.5052L64.5986 72.3138L64.6572 72.2201L64.7275 72.1381L66.4971 70.1576L66.708 69.9115L67.0127 69.7826L69.4502 68.7162L69.5439 68.681L69.6377 68.6576L72.1338 67.931L72.2627 67.8959L72.3916 67.8842L75.0049 67.6029L75.1572 67.5795L75.2979 67.5912L77.9346 67.8256H77.9229L80.2549 67.9896H80.2666L80.4189 68.0013L80.3838 68.4584L81.9775 67.7318L83.7119 66.0443L83.9814 65.7865L84.3447 65.681L86.9463 64.931L87.251 64.849L87.5674 64.8959ZM85.5283 68.4584L83.876 70.0873L83.6885 70.2748L83.4424 70.3802L81.4971 71.2592L80.2197 71.8334L79.751 70.9545L77.7002 70.8138H77.6768L75.1924 70.5912L72.79 70.8607L70.5283 71.517L68.501 72.3959L67.0127 74.0834L65.7236 76.0287L64.8096 78.1732L64.376 80.5873L64.083 82.9193L64.3291 85.2748L64.8916 87.5951L65.9229 89.6693L67.4111 91.7201L68.9111 93.724L70.6689 95.517L72.5205 97.017L74.665 98.2123H74.6768L74.7002 98.224L76.751 99.4545L78.7666 99.8177L80.876 99.2201L83.29 98.3412L83.3604 98.3177L83.4189 98.2943L85.9619 97.6263L86.2783 97.5326L86.5947 97.5912L88.9268 97.9779L91.0596 97.6029L93.0283 96.7826L94.5869 95.0599L96.1689 93.1381L97.54 91.0404L98.6299 88.7904L99.4385 86.4701L100.188 84.2787L99.9072 81.9701L99.8955 81.8177L99.9072 81.6771L100.083 79.1342L99.7783 76.9662L98.6533 74.8802V74.892L97.3877 72.6654L96.2275 70.6849L94.2939 69.5834V69.5951L92.208 68.4818L89.8408 68.2592L89.8057 68.2474H89.7705L87.4385 67.8959L85.5283 68.4584ZM80.3486 68.8685L80.4189 69.4779L80.4424 69.806L80.7588 69.6537L80.7705 69.642L80.3604 68.7279L80.3486 68.8685Z" fill="currentColor"/>
                        <path d="M29.8789 64.6182L32.4688 64.8995L32.6094 64.9112L32.75 64.9581L35.2695 65.7198L35.4453 65.7667L35.6094 65.8721L37.8828 67.2549L38.1641 67.4307L38.3398 67.6885L38.9609 68.6026L41.082 67.5245L41.5039 67.3135L41.9609 67.3721L44.4102 67.6885H44.3984L47.0117 67.9932L47.293 68.0284L47.5273 68.1573L52.2617 70.5948L52.543 70.7354L52.7422 70.9815L54.418 73.044L54.4297 73.0674L54.4414 73.0792L56.0703 75.2003L56.3047 75.5049L56.3633 75.8917L56.7617 78.5518L57.1484 81.1065V81.1417L57.5 83.7784L57.5352 84.0596L57.4766 84.3174L56.8672 86.9073L56.832 87.0714L56.75 87.2237L55.6602 89.4503L55.0039 91.9346L54.9102 92.2745L54.6758 92.5323L52.918 94.5479H52.9062V94.5596L51.1602 96.5049L51.1016 96.5753L51.043 96.6221L49.0742 98.3799L49.0156 98.4503L48.9336 98.4971L46.7656 100.009L46.6953 100.056L46.625 100.091L44.293 101.357L44.2695 101.368L44.2344 101.38L41.8203 102.54L41.4805 102.704L41.1055 102.692L38.4453 102.564H38.3867L38.3281 102.552L35.75 102.247L35.375 102.2L35.0703 101.989L33.1484 100.63L30.9805 100.173L28.543 100.149L28.4844 100.138H28.4258L25.8359 99.8917L25.4961 99.8565L25.2031 99.6807L22.918 98.2862L22.6367 98.1104L22.4609 97.8526L21.0078 95.7198L19.4023 93.6456L19.332 93.5518L19.2734 93.4464L17.9961 91.1495L17.9258 91.0089L16.918 88.5948L16.8711 88.4893L16.8477 88.3956L16.1914 85.8643L16.1797 85.8409V85.8174L15.582 83.251L15.5586 83.1221L15.5469 82.9932L15.4062 80.3565L15.3945 80.2042L15.418 80.0518L15.8047 77.4268L15.8281 77.3448L15.8516 77.251L16.543 74.7081L16.5898 74.544L16.6719 74.3917L17.9141 72.0831L17.9609 72.0128L19.3438 69.7862L19.4375 69.6339L21.4062 67.6651L21.5117 67.5479L21.6406 67.4659L23.832 66.0362L23.9258 65.9776L24.0195 65.9307L26.4336 64.8057L26.7148 64.6651H27.043L29.6914 64.6182L29.7852 64.6065L29.8789 64.6182ZM27.4062 67.6534L25.3789 68.6026L23.4219 69.8799L21.8047 71.5089L20.5508 73.501L19.3906 75.6573L18.7578 77.9659L18.3945 80.3565L18.5352 82.7471L19.0859 85.1026L19.6953 87.4698L20.6445 89.7432L21.8516 91.9112L23.375 93.8799L23.4102 93.9151L23.4336 93.9503L24.7461 95.8839L26.4688 96.9268L28.7188 97.1495H28.707L31.2266 97.1846L31.3672 97.1964L31.5078 97.2198L34.0625 97.7706L34.3672 97.8292L34.625 98.0049L36.4883 99.3057L38.5977 99.5635L40.8477 99.669L42.875 98.7081L45.1602 97.4659L47.1172 96.0948L48.9688 94.4424L50.668 92.5557L52.1797 90.8331L52.8008 88.5714L52.8359 88.4307L52.8945 88.3018L53.9844 86.0284L54.4766 83.8956L54.1719 81.5284V81.5167L53.7969 78.9971L53.4453 76.712L52.0859 74.9424L50.6094 73.1143L48.5234 72.0362L46.4141 70.9464L44.0352 70.6768V70.6651H44.0234L42.0312 70.4073L40.1562 71.3682L39.9688 71.462L39.7695 71.5089L39.0781 71.6378L38.832 70.419L38.6914 70.5128L38.6328 70.6768L38.0234 72.0479L37.9297 72.001L37.543 71.837L37.2969 71.4737L36.043 69.6456L34.1914 68.5206L31.9531 67.8526L29.6797 67.6182L27.4062 67.6534Z" fill="currentColor"/>
                        <path d="M55.8477 24.8633L55.8945 25.0156L55.9297 25.168L56.375 27.7344L56.3867 27.8047V27.875L56.5977 30.5117V33.3945L56.5859 33.5117L56.1523 36.0781L56.1172 38.5625V38.6562L56.1055 38.75L55.7188 41.3633L55.707 41.4219L55.6953 41.4688L54.5469 46.6484L54.5117 46.7656L54.4648 46.8828L53.457 49.3438L52.4492 51.7812L52.4258 51.8398L52.3906 51.9102L51.1719 54.2422L50 56.5742V56.5859L48.793 58.9531L48.7344 59.0586L48.6641 59.1523L47.0938 61.2969L47.082 61.3203L47.0586 61.3438L45.3945 63.418L45.3711 63.4531L45.3359 63.4883L43.543 65.4336L43.5312 65.4453L41.7266 67.3789L41.668 67.4375L41.6094 67.4844L39.875 68.9844L39.3594 70.4844L38 69.9922L37.6367 71.457L37.5781 71.4336L35.9727 71.0352L36.5234 69.4883L37.1914 67.6016L37.3203 67.2383L37.625 66.9688L39.5469 65.3047L41.3398 63.3945L43.1211 61.4609L44.7148 59.4688L46.1797 57.4766L47.3164 55.2383L48.5 52.8711L48.5117 52.8594V52.8477L49.6953 50.5977L50.6797 48.1953L51.6289 45.8867L52.1914 43.4023L52.7422 40.918L53.1172 38.375L53.1758 35.8555V35.75L53.1875 35.6445L53.5977 33.1602V30.7344L53.3984 28.0977H53.3867L52.9766 25.7891L52.1328 23.6562L52.0625 23.4688L52.0391 23.2812L52.0273 23.1758L53.5156 23L53.8672 22.9648L54.9219 22.543L55.8477 24.8633Z" fill="currentColor"/>
                        <path d="M67.6289 40.25L67.6523 40.2852L67.6641 40.3086L68.8945 42.3594L70.4883 44.457L72.0938 46.5547L72.1289 46.6133L72.1641 46.6602L73.5938 48.8867L73.6406 48.9688L73.6875 49.0625L74.7539 51.3477L76.1953 53.4219L76.2422 53.4805L76.2773 53.5508L77.543 55.8711L77.5898 55.9414L78.7266 58.3203L79.875 60.7109L79.9336 60.8281L79.9688 60.9688L80.6719 63.5234L80.6836 63.5586L80.6953 63.582L81.293 66.1484V66.1836L81.3047 66.2188L81.7852 68.8086L80.4609 69.0547L80.4375 69.1367L79.8398 70.5195L79.7109 70.4609L78.9844 70.1445L78.832 69.3594L78.3633 66.8281L77.7656 64.2617V64.25L77.1094 61.8828L76.0195 59.6328V59.6211L74.918 57.3125L73.6641 55.0508L72.2227 52.9531L72.1406 52.8477L72.0938 52.7305L71.0156 50.4336L69.7031 48.3828L68.0977 46.2734L66.5039 44.1641L66.457 44.1055L66.4102 44.0352L65.1328 41.9141L65.0742 41.832L67.582 40.168L67.6289 40.25Z" fill="currentColor"/>
                        <path d="M100.131 43.2333L100.372 43.0874L101.651 42.2994L101.594 42.2174L101.458 41.9895L101.26 41.8337L99.6495 40.5578L98.965 38.4643L98.9505 38.4139L98.9266 38.3499L97.8879 35.9167L97.8474 35.8138L97.7932 35.7203L96.4374 33.4548L96.3644 33.334L96.2757 33.2341L94.5988 31.35L93.1504 29.1983L93.0941 29.1164L93.0147 29.0302L91.2312 27.0786L91.1331 26.965L89.1476 25.2025L89.1174 25.173L89.0755 25.1415L86.9838 23.5022L86.7841 23.3579L86.5622 23.2691L84.056 22.3873L83.922 22.3386L83.7722 22.3109L81.1604 21.9339L81.1143 21.9254L81.0661 21.9284L78.5145 21.7413L75.9027 21.3644L73.2756 20.8773L73.1928 20.8739L70.5584 20.6835L67.9261 20.4815L67.8915 20.4751L65.2601 20.3328L65.258 20.3444L62.6824 20.0933L62.5651 20.0835L62.4341 20.083L59.9199 20.2724L57.4818 19.9873L54.8649 19.5736L54.6784 19.551L54.4855 19.5629L52.0205 19.8091L51.8591 19.7792L51.8621 19.8274L51.8391 19.8231L51.8514 19.885L51.6224 21.2489L51.3835 22.7302L51.7523 22.7985L51.9388 22.8212L52.1317 22.8093L54.5831 22.5725L57.0293 22.9426L57.0754 22.9511L59.7115 23.2611L59.8497 23.2867L59.9944 23.2778L62.4949 23.0978L65.038 23.3309L65.0632 23.3236L65.0977 23.33L67.681 23.4752L67.6925 23.4774L70.3384 23.67L72.867 23.8527L75.4826 24.3376L78.0965 24.7031L78.1426 24.7116L78.1908 24.7086L80.7288 24.905L83.2117 25.27L85.3138 26.0173L87.231 27.505L89.0397 29.1275L90.7136 30.9634L92.1454 33.0762L92.2017 33.1581L92.2717 33.2307L93.9255 35.1106L95.178 37.2259L96.0981 39.3988L96.9332 41.9015L97.0702 42.3202L97.4235 42.6003L99.3833 44.1793L100.131 43.2333Z" fill="currentColor"/>
                        <path d="M57.1276 22.268L58.3414 24.4L58.4071 24.4956L58.4361 24.5963L59.3992 27.0513L59.4397 27.1542L59.4666 27.2664L60.0034 29.6424L61.0934 31.7991L61.1049 31.8012L62.3886 34.0057L63.9519 35.988L65.6031 37.6886L67.61 39.0141L69.8622 40.3017L72.0906 41.5253L74.4206 42.4578L76.7382 43.3285L79.1165 43.6145L81.5035 43.5326L84.0526 43.2186L86.5408 42.6549L86.6783 42.6208L86.8114 42.6097L89.3631 42.475L91.8538 42.0905L94.4508 41.5828L94.5127 41.5704L94.5725 41.5696L97.2023 41.2705L97.3858 41.245L97.5723 41.2676L100.108 41.6066L99.9637 42.6406L100.011 43.0904L100.14 44.5803L100.044 44.5863L99.8741 44.6025L99.7106 44.5841L97.3272 44.2614L94.9133 44.5528L94.9039 44.5391L92.4285 45.0337L92.3782 45.0482L89.7752 45.4595L89.6881 45.4791L89.6169 45.4778L87.0558 45.5989L84.6482 46.1775L84.5612 46.1972L84.4762 46.2053L81.8558 46.518L81.796 46.5188L81.7342 46.5312L79.083 46.6237L78.9751 46.6275L78.8598 46.6061L76.2122 46.294L76.0372 46.2735L75.8593 46.2048L73.3752 45.2675L73.3407 45.2611L70.8997 44.2841L70.8118 44.244L70.7355 44.206L68.4192 42.9423L68.4098 42.9286L68.3983 42.9265L66.1158 41.6094L66.0718 41.5894L66.0394 41.5714L63.8192 40.111L63.6822 40.0141L63.561 39.8963L61.7114 37.9801L61.6508 37.9212L61.6017 37.8644L59.9655 35.7614L59.907 35.691L59.8622 35.6112L58.5107 33.3225L58.494 33.2837L58.4659 33.2427L57.2603 30.8739L57.1822 30.7164L57.1451 30.5307L56.5533 28.0016L55.6784 25.7775L54.4647 23.6455L54.4011 23.5384L54.3555 23.3988L54.2288 23.0535L57.0602 22.0529L57.1276 22.268Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Cherry
                    </h3>
                    <p className="text-muted-foreground">
                      Fruit
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Spin Button - Now below cards */}
        <div className="text-center mb-8">
          <Button 
            onClick={spinRoulette}
            disabled={isSpinning}
            className="px-12 py-4 text-2xl font-bold bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
          >
            {isSpinning ? 'Spinning...' : 'Where Should I Go?'}
          </Button>
        </div>

        {/* Result Message */}
        {resultMessage && (
          <div className="text-center mt-8">
            <p className="text-xl font-medium text-foreground bg-orange-50 border border-orange-200 rounded-lg px-6 py-4 max-w-2xl mx-auto">
              {resultMessage}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-foreground mb-2">
            {icons.length} icons ©{' '}
            <a
              href="https://partdirector.ch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-orange-600 transition-colors underline"
              onClick={() => trackEvent('STUDIO_PARTDIRECTOR_FOOTER_CLICKED')}
            >
              Studio Partdirector
            </a>
            , 2025
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:icons@partdirector.ch?subject=City Request&body=Please add: [City, Country]"
              className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
              onClick={() => trackEvent('MISSING_CITY_CLICKED')}
            >
              Missing your city?
            </a>
            <span className="text-sm text-muted-foreground">•</span>
            <Link
              href="/license"
              className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
              onClick={() => trackEvent('LICENSE_LINK_CLICKED')}
            >
              Usage & Licensing
            </Link>
            <span className="text-sm text-muted-foreground">•</span>
            <a
              href="https://github.com/anto1/city-icons"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
              onClick={() => trackEvent('GITHUB_LINK_CLICKED')}
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
} 
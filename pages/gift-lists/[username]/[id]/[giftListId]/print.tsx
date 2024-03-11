import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Markdown from 'react-markdown';
import { useIsClient } from 'usehooks-ts';

import { EmptyLayout } from '../../../../../components/layout/EmptyLayout';
import { useI18n } from '../../../../../i18n/useI18n';
import { useFindGiftListByIdQuery } from '../../../../../services/apis/react-query/queries/useFindGiftListByIdQuery';
import { Gift } from '../../../../../services/types/prisma.type';

const PrintGiftListItem = ({ gift }: { gift: Gift }) => {
  return (
    <div className="flex gap-3">
      <div>-</div>
      <div>
        <p className="text-lg font-bold line-clamp-1">{gift.name}</p>
        <Markdown className="!text-sm !opacity-80">{gift?.description}</Markdown>
        {gift?.link && (
          <a href={gift?.link} className="pt-1 !text-sm italic underline">
            {gift?.link}
          </a>
        )}
      </div>
    </div>
  );
};

const PrintGiftList = () => {
  const router = useRouter();
  const { t } = useI18n();
  const isBrowser = useIsClient();

  const { data: giftListData, isFetching } = useFindGiftListByIdQuery(
    {
      userId: router.query.id as string,
      id: router.query.giftListId as string,
      password: router.query.password as string,
    },
    //@ts-ignore
    {
      enabled: !!router.query.id && !!router.query.giftListId,
    },
  );

  const haveHighPriority = giftListData?.gifts.some((gift) => gift.priority === 3 && gift.takenWhen === null);
  const haveMediumPriority = giftListData?.gifts.some((gift) => gift.priority === 2 && gift.takenWhen === null);
  const haveLowPriority = giftListData?.gifts.some((gift) => gift.priority === 1 && gift.takenWhen === null);
  const haveNoPriority = giftListData?.gifts.some((gift) => gift.priority === 0 && gift.takenWhen === null);

  useEffect(() => {
    if (giftListData && isBrowser) {
      window.print();
    }
  }, [giftListData, isBrowser]);

  return (
    <div className="relative space-y-8">
      <h1 className="text-xl font-bold">
        {t('pages.profile.seo', { username: router.query.username })} {giftListData?.name && ` - ${giftListData.name}`}
      </h1>

      {isFetching && <>Loading... Please wait !</>}

      {giftListData && (
        <>
          {haveHighPriority && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="mb-1">
                  <div className="h-6 w-6 bg-error"></div>
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase">{t('components.modules.gift.priority.high')}</h3>
                </div>
              </div>

              {giftListData.gifts
                .filter((v) => v.priority === 3 && v.takenWhen === null)
                .map((gift) => (
                  <PrintGiftListItem key={gift?.id} gift={gift} />
                ))}
            </div>
          )}

          {haveMediumPriority && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="mb-1">
                  <div className="h-6 w-6 bg-warning"></div>
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase">{t('components.modules.gift.priority.middle')}</h3>
                </div>
              </div>

              {giftListData.gifts
                .filter((v) => v.priority === 2 && v.takenWhen === null)
                .map((gift) => (
                  <PrintGiftListItem key={gift?.id} gift={gift} />
                ))}
            </div>
          )}

          {haveLowPriority && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="mb-1">
                  <div className="h-6 w-6 bg-info"></div>
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase">{t('components.modules.gift.priority.low')}</h3>
                </div>
              </div>

              {giftListData.gifts
                .filter((v) => v.priority === 1 && v.takenWhen === null)
                .map((gift) => (
                  <PrintGiftListItem key={gift?.id} gift={gift} />
                ))}
            </div>
          )}

          {haveNoPriority && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="mb-1">
                  <div className="h-6 w-6 bg-gray-500"></div>
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase">{t('components.modules.gift.priority.nc')}</h3>
                </div>
              </div>

              {giftListData.gifts
                .filter((v) => v.priority === 0 && v.takenWhen === null)
                .map((gift) => (
                  <PrintGiftListItem key={gift?.id} gift={gift} />
                ))}
            </div>
          )}
        </>
      )}
      <style
        dangerouslySetInnerHTML={{
          __html: `
      @media print {
        body {
                -webkit-print-color-adjust: exact;
                -moz-print-color-adjust: exact;
                -ms-print-color-adjust: exact;
                print-color-adjust: exact;
            }
      }`,
        }}
      ></style>

      {/* <footer className="bottom-0 m-auto hidden w-full text-center italic print:fixed print:block">
        Gift App - https://gift.qlaffont.com
      </footer> */}
    </div>
  );
};

PrintGiftList.Layout = EmptyLayout;

export default PrintGiftList;

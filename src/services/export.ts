import { Congregation } from '../models/congregation';
import { Parent, Part, WeekProgram } from '../models/wol';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import {
  TDocumentDefinitions,
  StyleDictionary,
  Content
} from 'pdfmake/interfaces';
import moment from 'moment';
import firebase from 'firebase/app';


pdfMake.vfs = pdfFonts.pdfMake.vfs;
export class ExportService {

  docDefinition: TDocumentDefinitions = {
    info: {
      title: '',
      author: '',
      subject: '',
      keywords: '',
    },
    content: [],
    styles: {},
  };
  partDefinition: TDocumentDefinitions = {
    pageSize: 'B7',
    info: {
      title: 'Devoir d\'éléve a la Réunion\n Vie Chrétienne et Ministere',
    },
    content: [],
    pageMargins: [15, 10, 15, 10],
    styles: {},
  };

  docStyles: StyleDictionary = {
    header: {
      fontSize: 18,
      bold: true,
      color: '#000000',
    },
    subheader: {
      fontSize: 12,
      bold: false,
      color: '#9e9e9e',
    },
    treasures: {
      fontSize: 16,
      bold: true,
      color: '#656164',
    },
    apply: {
      fontSize: 16,
      bold: true,
      color: '#a56803',
    },
    life: {
      fontSize: 16,
      bold: true,
      color: '#99131e',
    },
    weekend: {
      fontSize: 16,
      bold: true,
      color: '#808080',
    },
    label: {
      fontSize: 12,
      bold: false,
      color: '#808080',
    },
    part: {
      fontSize: 10,
      bold: false,
      color: '#000000',
    },
    partSecondary: {
      fontSize: 10,
      bold: true,
      color: '#000000',
      margin: [0, 2],
    },
    partValue: {
      fontSize: 10,
      bold: true,
      color: '#000000',
      alignment: 'right',
      margin: [0, 2],
    },
    partValueSecondary: {
      fontSize: 8,
      bold: true,
      color: '#000000',
      alignment: 'right',
    },
    value: {
      fontSize: 12,
      bold: true,
      color: '#000000',
      margin: [0, 2],
    },
  };
  partStyles: StyleDictionary = {
    title: {
      fontSize: 12,
      bold: true,
      alignment: 'center',
      color: '#000000',
    },
    label: {
      fontSize: 10,
      bold: true,
      color: '#000000',
    },
    info: {
      fontSize: 6,
      bold: true,
      color: '#000000',
    },
    note: {
      fontSize: 8,
      bold: false,
      color: '#9E9E9D',
    },
    noteLabel: {
      fontSize: 8,
      bold: true,
      color: '#9E9E9D',
    },
    value: {
      fontSize: 12,
      bold: false,
      color: '#000000',
    },
  };

  filterPart(
    parts: Part[]
  ): {
    treasures: Part[];
    apply: Part[];
    applySecondary: Part[];
    bibleSecondary: Part;
    life: Part[];
    talk: Part[];
    wt: Part[];
    chairmans: Part[];
    prayers: Part[];
  } {
    let _parts = {
      treasures: parts
        .filter((part) => part.parent === Parent.treasures)
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 1)),
      bibleSecondary: parts
        .filter((part) => part.parent === Parent.secondary)
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 1))[0],
      applySecondary: parts
      .filter((part) => part.parent === Parent.secondary)
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 1))
      .slice(1, parts
        .filter((part) => part.parent === Parent.secondary).length),
      apply: parts
        .filter((part) => part.parent === Parent.apply)
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 1)),
      life: parts
        .filter((part) => part.parent === Parent.life)
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 1)),
      talk: parts
        .filter((part) => part.parent === Parent.talk)
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 1)),
      wt: parts
        .filter((part) => part.parent === Parent.wt)
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 1)),
      chairmans: parts
        .filter((part) => part.parent === Parent.chairman)
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 1)),
      prayers: parts
        .filter((part) => part.parent === Parent.prayer)
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 1)),
    };
    return _parts;
  }

  downloadPartPDF(part: Part) {
    return new Promise((resolve, reject) => {
      if (part.assignee) {
        
        let content: Content = this.parsePart(part);
        this.partDefinition.content = content;
        this.partDefinition.styles = this.partStyles;
        setTimeout(() => {
          pdfMake
            .createPdf(this.partDefinition)
            .download(
              `Fiche_Exposé_à_la_réunion_Vie_chrétienne_et_ministère-${moment(part.date.toDate()).locale('fr').format(
                'MMM-DD-YY'
              )}-${
                part?.assignee?.firstName?.slice(0, 1) +
                '-' +
                part?.assignee?.lastName
              }.pdf`
            );
          resolve(true);
        }, 1000);
      }
    });
  }

  parsePart(part: Part) : Content {
    let content : Content = [
      {
        text: 'Devoir D\'éléve a la réunion\n vie chrétienne et ministere\n'.toUpperCase(),
        style: 'title',
        margin: [0, 0, 0, 20],
      },
      {
        text: [
          {
            text: `Nom: `,
            style: 'label',
          },
          {
            text: `${
              part.assignee
                ? part?.assignee?.firstName +
                  ' ' +
                  part.assignee.lastName
                : ''
            }`,
            style: 'value',
          },
        ],
        margin: [0, 0, 0, 5],
      },
      {
        text: [
          {
            text: `Interlocuteur: `,
            style: 'label',
          },
          {
            text: `${part.assistant ?
              part.assistant?.firstName?.slice(0, 1).toUpperCase() +
              '. ' +
              part?.assistant?.lastName : ''
            }`,
            style: 'value',
          },
        ],
        margin: [0, 0, 0, 5],
      },
      {
        text: [
          {
            text: `Date: `,
            style: 'label',
          },
          {
            text: `${moment(part.date.toDate()).format('MMMM YYYY')}`,
            style: 'value',
          },
        ],
        margin: [0, 0, 0, 10],
      },
      {
        text: 'Devoir d\'éléve :',
        style: 'label',
        margin: [0, 10, 0, 5],
      },
      {
        text: part.title ?? '',
        style: 'value',
        margin: [10, 0, 0, 10],
      },
      {
        text: 'A présenter dans:',
        style: 'label',
        margin: [0, 0, 0, 5],
      },
      {
        text: part && part.assignee && part.parent === Parent.secondary ? 'Deuxieme Salle' : 'Salle Principale',
        style: 'value',
        margin: [10, 0, 0, 20],
      },
      {
        text: [
          {
            text: 'A présenter dans: ',
            style: 'noteLabel',
          },
          {
            text:
              'Les sources pour ton devoir et le point que tu dois travailler dont précisés dans le Cahier Vie et ministere. Chaque point a travailler fait l\'objet d\'une leçon de la brochure Enseignement.',
            style: 'note',
          },
        ],
      },
    ];
    
    return content
  }

  parsePDFPage(
    congInfo: Congregation,
    weekProgram: WeekProgram,
    parts: Part[]
  ) : Content {
    let filteredParts = this.filterPart(parts);

      let content: Content = 
        [{
          columns: [
            [
              {
                text: congInfo?.properties?.orgName ?? '',
                style: 'subheader',
              },
              {
                text: 'Programme de la Réunion',
                style: 'header',
              },
            ],
            {
              text: weekProgram?.range ?? '',
              alignment: 'right',
              margin: [0, 7],
              fontSize: 22,
              bold: true,
            },
          ],
          margin: [0, 20, 0, 0],
        },
        {
          svg:
            '<svg xmlns="http://www.w3.org/2000/svg" width="1166" height="1" viewBox="0 0 1166 1"><line id="Line_13" data-name="Line 13" x2="1166" transform="translate(0 0.5)" fill="none" stroke="#707070" stroke-width="1"/></svg>',
          width: 520,
          margin: [0, 3, 0, 10],
        },
        {
          columns: [
            [
              {
                text: 'Président',
                style: 'label',
              },
              {
                text: `${
                  filteredParts?.chairmans[0]?.assignee?.firstName ?? ''
                } ${filteredParts?.chairmans[0]?.assignee?.lastName ?? ''}`,
                style: 'value',
              },
            ],
            [
              {
                text: 'Priere',
                style: 'label',
              },
              {
                text:
                  filteredParts.prayers[0] && filteredParts.prayers[0].assignee
                    ? `${filteredParts.prayers[0].assignee.firstName} ${filteredParts.prayers[0].assignee.lastName}`
                    : '',
                style: 'value',
              },
            ],
          ],
        },
        {
          text: 'JOYAUX DE LA PAROLE DE DIEU',
          style: 'treasures',
          margin: [0, 15, 0, 0],
        },
        {
          markerColor: '#808080',
          ul: filteredParts.treasures.map((part) => {

            return {
              columns: [
                {
                  text: part.title ?? '',
                  style: 'part',
                },
                {
                  text:
                    part && part.assignee
                      ? `${part.assignee.firstName} ${part.assignee.lastName}`
                      : '',
                  style: 'partValue',
                },
              ],
              margin: [0, 10, 0, 0],
            };

          }),
        },
        // {
        //   markerColor: '#808080',
        //   ul: [
        //     {
        //       columns: [
        //         {
        //           text: 'Classe Secondaire',
        //           style: 'partSecondary',
        //         },
        //         // {
        //         //   text:
        //         //   filteredParts.bibleSecondary && filteredParts.bibleSecondary.assignee
        //         //       ? `${filteredParts.bibleSecondary.assignee.firstName} ${filteredParts.bibleSecondary.assignee.lastName}`
        //         //       : '',
        //         //   style: 'partValueSecondary',
        //         // },
        //       ],
        //     }
        //   ]
        // },
        {
          text: 'APPLIQUE-TOI AU MINISTÈRE',
          style: 'apply',
          margin: [0, 15, 0, 0],
        },
        {
          markerColor: '#808080',
          ul: filteredParts.apply.map((part, index) => {
            return {
              columns: [
                [
                  {
                    text: `${part?.title?.split(')')[0]})`,
                    style: 'part',
                  },
                  {
                    text: part && part.assistant ? `Interlocuteur` : '',
                    style: 'part',
                  },
                  // {
                  //   text: 'Classe Secondaire',
                  //   style: 'partSecondary',
                  // },
                ],
                [
                  {
                    text:
                      part && part.assignee
                        ? `${part.assignee.firstName} ${part.assignee.lastName}`
                        : '',
                    style: 'partValue',
                  },
                  {
                    text:
                      part && part.assistant
                        ? `${part.assistant.firstName} ${part.assistant.lastName}`
                        : '',
                    style: 'partValue',
                  },
                  // {
                  //   text:
                  //     filteredParts.applySecondary.length > 0 && filteredParts.applySecondary[index] && filteredParts.applySecondary[index].assignee
                  //       ? `${filteredParts.applySecondary[index].assignee?.firstName} ${filteredParts.applySecondary[index].assignee?.lastName} / ${filteredParts.applySecondary.length > 0 && filteredParts.applySecondary[index] && filteredParts.applySecondary[index].assistant
                  //         ? `${filteredParts.applySecondary[index].assistant?.firstName} ${filteredParts.applySecondary[index].assistant?.lastName}`
                  //         : ''}`
                  //       : '',
                  //   style: 'partValueSecondary',
                  // },
                ],
              ],
              margin: [0, 10, 0, 0],
            };
          }),
        },
        {
          text: 'VIE CHRÉTIENNE',
          style: 'life',
          margin: [0, 15, 0, 0],
        },
        {
          markerColor: '#808080',
          ul: filteredParts.life.map((part) => {
            return {
              columns: [
                [
                  {
                    text: `${part.title?.split(')')[0]})`,
                    style: 'part',
                  },
                  {
                    text: part && part.assistant ? `Lecteur` : '',
                    style: 'part',
                  },
                ],
                [
                  {
                    text:
                      part && part.assignee
                        ? `${part.assignee.firstName} ${part.assignee.lastName}`
                        : '',
                    style: 'partValue',
                  },
                  {
                    text:
                      part && part.assistant
                        ? `${part.assistant.firstName} ${part.assistant.lastName}`
                        : '',
                    style: 'partValue',
                  },
                ],
              ],
              margin: [0, 10, 0, 0],
            };
          }),
        },
        {
          text: 'Priere',
          style: 'label',
          margin: [0, 10, 0, 0],
        },
        {
          text:
            filteredParts.prayers[1] && filteredParts.prayers[1].assignee
              ? `${filteredParts.prayers[1].assignee.firstName} ${filteredParts.prayers[1].assignee.lastName}`
              : '',
          style: 'value',
        },
        {
          svg:
            '<svg xmlns="http://www.w3.org/2000/svg" width="1166" height="1" viewBox="0 0 1166 1"><line id="Line_13" data-name="Line 13" x2="1166" transform="translate(0 0.5)" fill="none" stroke="#707070" stroke-width="1"/></svg>',
          width: 520,
          margin: [0, 10, 0, 1],
        },
        {
          text: 'Classe Secondaire',
          style: 'weekend',
          margin: [0, 15, 0, 0],
        },
        {
          text: 'JOYAUX DE LA PAROLE DE DIEU',
          style: 'treasures',
          margin: [0, 15, 0, 0],
        },
        {
          markerColor: '#808080',
          ul: [
            {
              columns: [
                [
                  {
                    text: `${filteredParts.bibleSecondary && filteredParts.bibleSecondary?.title?.split(')')[0]})`,
                    style: 'part',
                  }, 
                  {
                    text:
                    filteredParts.bibleSecondary && filteredParts.bibleSecondary.assignee
                        ? `${filteredParts.bibleSecondary.assignee.firstName} ${filteredParts.bibleSecondary.assignee.lastName}`
                        : '',
                    style: 'partValue',
                  },
  
                ]
              ],
              margin: [0, 10, 0, 0],
            }
          ]
        },
        {
          text: 'APPLIQUE-TOI AU MINISTÈRE',
          style: 'apply',
          margin: [0, 15, 0, 0],
        },
        {
          markerColor: '#808080',
          ul: filteredParts.applySecondary.map((part, index) => {
            return {
              columns: [
                [
                  {
                    text: `${part?.title?.split(')')[0]})`,
                    style: 'part',
                  },
                  {
                    text: part && part.assistant ? `Interlocuteur` : '',
                    style: 'part',
                  },
                ],
                [
                  {
                    text:
                      part && part.assignee
                        ? `${part.assignee.firstName} ${part.assignee.lastName}`
                        : '',
                    style: 'partValue',
                  },
                  {
                    text:
                      part && part.assistant
                        ? `${part.assistant.firstName} ${part.assistant.lastName}`
                        : '',
                    style: 'partValue',
                  },
                ],
              ],
              margin: [0, 10, 0, 0],
            };
          }),
        },
        // {
        //   columns: [
        //     [
        //       {
        //         text: 'Président',
        //         style: 'label',
        //       },
        //       {
        //         text: `${
        //           filteredParts?.chairmans[1]?.assignee?.firstName ?? ''
        //         } ${filteredParts?.chairmans[1]?.assignee?.lastName ?? ''}`,
        //         style: 'value',
        //       },
        //     ],
        //   ],
        //   margin: [0, 10, 0, 1],
        // },
        // {
        //   text: `Frère ${filteredParts.talk[0]?.assignee?.firstName ?? ""} ${filteredParts?.talk[0]?.assignee?.lastName ?? ""} - ${filteredParts?.talk[0]?.assignee?.speaker?.congregation?.properties?.orgName ?? ""}`,
        //   style: 'label',
        //   margin: [0, 10, 0, 0],
        // },
        // {
        //   text: filteredParts.talk[0]?.title ?? '',
        //   style: 'value',
        // },
        // {
        //   text: 'Etude de la Tour de Garde',
        //   style: 'weekend',
        //   margin: [0, 10, 0, 0],
        // },
        // {
        //   columns: [
        //     [
        //       {
        //         text: 'Conducteur',
        //         style: 'label',
        //       },
        //       {
        //         text: `${filteredParts?.wt[0]?.assignee?.firstName ?? ''} ${filteredParts?.wt[0]?.assignee?.lastName ?? ''}`,
        //         style: 'value',
        //       },
        //     ],
        //     [
        //       {
        //         text: 'Lecteur',
        //         style: 'label',
        //       },
        //       {
        //         text: `${filteredParts?.wt[0]?.assistant?.firstName ?? ""} ${filteredParts?.wt[0]?.assistant?.lastName ?? ''}`,
        //         style: 'value',
        //       },
        //     ],
        //   ],
        //   margin: [0, 5, 0, 0],
        // }
      ];
      return content
  }


async downloadPDF(
    weeks: WeekProgram[],
    congregation: Congregation,
    fireStore: firebase.firestore.Firestore
  ) : Promise<boolean> {

    return new Promise((resolve, reject) => {

      const docDefinition : TDocumentDefinitions = {
        content : [],
        styles: this.docStyles
      }
        const promises : Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>[] = weeks.map(week => {
          let docs = fireStore
          .collection(`congregations/${congregation.id}/weeks/${week.id}/parts`)
          .get()
             return docs
        })

        let all = Promise.all(promises);
        all.then(data => {
          let arrayOfContent = data.map(a => {
            let parts : Part[] = a.docs.map(d => d.data());
            let week : WeekProgram = weeks.filter(w => w.id === parts[0].week)[0]
            return this.parsePDFPage(congregation, week, parts)
          });
          if (arrayOfContent.length > 0) {

            docDefinition.content = weeks.length > 1 ? 
              arrayOfContent.map(array => [
                array,
                {
                  text: '',
                  pageBreak: 'after'
                }
              ]) : arrayOfContent;

              pdfMake
              .createPdf(docDefinition)
              .download(`Programme Vie et Ministere - ${weeks.length > 1 ? 
              moment(weeks[0].date.toDate())
              .format('MMMM yyyy') : 
              weeks[0].range}.pdf`)

            return resolve(true);
          }
          return reject('There was an error fetching the content')
        })
    });
  }

}

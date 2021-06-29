import { Stack } from '@fluentui/react'
import React, { useContext } from 'react'
import { Part, PartType, WeekProgram } from './../models/wol';
import { bibleReadingSecondary, applySecondary} from '../shared/methods';
import PartAssigneeButton from './PartAssigneeButton';
import { GlobalContext } from '../store/GlobalState';
import PartRemoveButton from './PartRemoveButton';
import PartContextMenu from './PartContextMenu';


export default function SecondaryClassView({ parts, week }: { parts: Part[], week: WeekProgram }) {

    const { openPanel, selectPublisher, isMobile } = useContext(GlobalContext)
    return (
        <div>
            <Stack>
                <div className={`${isMobile ? 'p-4' : 'p-10'} rounded bg-white shadow my-4`}>
                    <h3 className="mt-0 text-xl font-semibold">Classe Secondaire</h3>

                    <h4 className="my-3 font-semibold text-lg treasures">JOYAUX DE LA PAROLE DE DIEU</h4>
                    {
                        parts && bibleReadingSecondary(parts) ?
            
                                <div className="mt-3 pl-4 flex flex-wrap justify-between items-center" key={bibleReadingSecondary(parts).id}>
                                    <label className={isMobile ? 'text-xs' : ''}>{bibleReadingSecondary(parts).title}</label>
                                    <div className="inline-flex items-center my-2">
                                    {
                                        bibleReadingSecondary(parts) && bibleReadingSecondary(parts).assignee ?
                                            <PartRemoveButton
                                                action={() => {
                                                    selectPublisher(week, bibleReadingSecondary(parts), PartType.assignee, bibleReadingSecondary(parts).assignee)
                                                    openPanel()
                                                }}
                                                part={bibleReadingSecondary(parts)}
                                                publisher={bibleReadingSecondary(parts).assignee ?? {}} /> :
                                            <PartAssigneeButton text="Assignee" action={() => {
                                                selectPublisher(week, bibleReadingSecondary(parts), PartType.assignee, null)
                                                openPanel()
                                            }} />
                                    }
                                    {
                                        bibleReadingSecondary(parts) ? <PartContextMenu part={bibleReadingSecondary(parts)} /> : null
                                    }
                                    </div>

                                </div> : null
                    }

                    <h4 className="my-3 font-semibold text-lg apply">APPLIQUE-TOI AU MINISTÈRE</h4>
                    {
                        parts && applySecondary(parts).map((part, index) => {
                            return (
                                <div key={part.id}>
                                    <div className="mt-3 pl-4 flex flex-wrap justify-between items-center">
                                        <label className={isMobile ? 'text-xs' : 'w-2/3'}>{part.title}</label>
                                        <div className="inline-flex flex-wrap items-center my-2">
                                            {
                                                part && part.assignee ?
                                                    <PartRemoveButton
                                                        action={() => {
                                                            selectPublisher(week, part, PartType.assignee, part.assignee)
                                                            openPanel()
                                                        }}
                                                        part={part}
                                                        publisher={part.assignee ?? {}} /> :
                                                    <PartAssigneeButton text="Assignee" action={() => {
                                                        selectPublisher(week, part, PartType.assignee, null)
                                                        openPanel()
                                                    }} />
                                            }
                                            <span className="text-gray-200 mx-1">-</span>
                                            {
                                                part && part.assistant ?
                                                    <PartRemoveButton
                                                        action={() => {
                                                            selectPublisher(week, part, PartType.assistant, part.assistant)
                                                            openPanel()
                                                        }}
                                                        part={part}
                                                        publisher={part.assistant ?? {}} /> :
                                                    <PartAssigneeButton text="Assistant" action={() => {
                                                        selectPublisher(week, part, PartType.assistant, null)
                                                        openPanel()
                                                    }} />
                                            }
                                            {
                                                part ? <PartContextMenu part={part} /> : null
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </Stack>
        </div>
    )
}

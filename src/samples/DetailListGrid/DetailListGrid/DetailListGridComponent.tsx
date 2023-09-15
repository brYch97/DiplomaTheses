import * as React from 'react';
import {IInputs} from "./generated/ManifestTypes";
import { Link } from '@fluentui/react/lib/Link';
import { Label } from '@fluentui/react/lib/Label';
import { ScrollablePane, ScrollbarVisibility } from '@fluentui/react/lib/ScrollablePane';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { Sticky, StickyPositionType } from '@fluentui/react/lib/Sticky';
import { IRenderFunction, SelectionMode } from '@fluentui/react/lib/Utilities';
import { DetailsListLayoutMode, Selection, IColumn, ConstrainMode, IDetailsHeaderProps } from '@fluentui/react/lib/DetailsList';
import { TooltipHost, ITooltipHostProps } from '@fluentui/react/lib/Tooltip';
import * as lcid from 'lcid';
import { Image, Stack, initializeIcons } from '@fluentui/react';

export interface IProps {
    pcfContext: ComponentFramework.Context<IInputs>,
    dataSetVersion: number
}

interface IColumnWidth {
    name: string,
    width: number
}
initializeIcons();

export const DetailListGridControl: React.FC<IProps> = (props) => {                           
    const [columns, setColumns] = React.useState(getColumns(props.pcfContext));
    const [items, setItems] = React.useState(getItems(columns, props.pcfContext));
    const [logoUrl, setLogoUrl] = React.useState<string>();
    const isDataLoaded = true;
    const [selectedItemCount, setSelectedItemCount] = React.useState(0);    
    React.useEffect(() => {       
        setItems(getItems(columns, props.pcfContext));
        }, [props.dataSetVersion]);
        
    React.useEffect(() => {
        props.pcfContext.resources.getResource('img/logo.png', (data => setLogoUrl(`data:image/png;base64, ${data}`)), () => {})
    }, []);
    
    React.useEffect(() => {
        setColumns(updateColumnWidths(columns, props.pcfContext));
        }, [props.pcfContext.mode.allocatedWidth]);        
    
    const _selection = new Selection({
        onSelectionChanged: () => {
            _setSelectedItemsOnDataSet()
        }
    }); 
    const _setSelectedItemsOnDataSet = () => {
        let selectedKeys = [];
        let selections = _selection.getSelection();
        for (let selection of selections)
        {
            selectedKeys.push(selection.key as string);
        }
        setSelectedItemCount(selectedKeys.length);
        props.pcfContext.parameters.sampleDataSet.setSelectedRecordIds(selectedKeys);
    }      

    const _onColumnClick = (ev?: React.MouseEvent<HTMLElement>, column?: IColumn): void => {
        let isSortedDescending = column?.isSortedDescending;
    
        if (column?.isSorted) {
          isSortedDescending = !isSortedDescending;
        }

        setItems(copyAndSort(items, column?.fieldName!, props.pcfContext, isSortedDescending));
        setColumns(
            columns.map(col => {
                col.isSorted = col.key === column?.key;
                col.isSortedDescending = isSortedDescending;
                return col;
            })
        );
    }      
    
    const _onRenderDetailsHeader = (props: IDetailsHeaderProps | undefined, defaultRender?: IRenderFunction<IDetailsHeaderProps>): JSX.Element => {
        return (
            <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
                {defaultRender!({
                    ...props!,
                    onRenderColumnHeaderTooltip: (tooltipHostProps: ITooltipHostProps | undefined) => <TooltipHost {...tooltipHostProps} />
                })}
            </Sticky>
        )
    }

    return (
        <>
        <Image src={logoUrl} />
        <Stack grow
            styles={{
                root: {
                  width: "100%",
                  height: "inherit",
                },
              }}>
        <Stack.Item 
            verticalFill 
                styles={{
                    root: {
                        height: "100%",
                        overflowY: "auto",
                        overflowX: "auto",
                    },
                }}
                  >
        <div 
            style={{ position: 'relative', height: '100%' }}>
        <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>            
                <ShimmeredDetailsList
                        enableShimmer={!isDataLoaded}
                        className = 'list'                        
                        items={items}
                        columns= {columns}
                        setKey="set"                                                                                         
                        selection={_selection}                                      
                        onColumnHeaderClick={_onColumnClick}                 
                        selectionPreservedOnEmptyClick={true}
                        ariaLabelForSelectionColumn="Toggle selection"
                        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                        checkButtonAriaLabel="Row checkbox"                        
                        selectionMode={SelectionMode.multiple}
                        onRenderDetailsHeader={_onRenderDetailsHeader}
                        layoutMode = {DetailsListLayoutMode.justified}
                        constrainMode={ConstrainMode.unconstrained}
                    />       
        </ScrollablePane>
        </div>
        </Stack.Item>
        <Stack.Item align="start">
            <div className="detailList-footer">
               <Label className="detailList-gridLabels">Records: {items.length.toString()} ({selectedItemCount} selected)</Label>               
            </div>
        </Stack.Item>
        </Stack>
        </>             
    );
};

const navigate = (item: any, linkReference: string | undefined, pcfContext: ComponentFramework.Context<IInputs>) => {        
    pcfContext.parameters.sampleDataSet.openDatasetItem(item[linkReference + "_ref"])
};

const getItems = (columns: IColumn[], pcfContext: ComponentFramework.Context<IInputs>) => {
    let dataSet = pcfContext.parameters.sampleDataSet;

    const resultSet = dataSet.sortedRecordIds.map(function (key) {
        const record = dataSet.records[key];
        const newRecord: any = {
            key: record.getRecordId()
        };

        for (const column of columns)
        {                
            newRecord[column.key] = record.getFormattedValue(column.key);
            if (isEntityReference(record.getValue(column.key)))
            {
                const ref = record.getValue(column.key) as ComponentFramework.EntityReference;
                newRecord[column.key + '_ref'] = ref;
            }
            else if(column.data.isPrimary)
            {
                newRecord[column.key + '_ref'] = record.getNamedReference();
            }
        }            

        return newRecord;
    });          
            
    return resultSet;
}  

const getColumns = (pcfContext: ComponentFramework.Context<IInputs>) : IColumn[] => {
    let dataSet = pcfContext.parameters.sampleDataSet;
    let iColumns: IColumn[] = [];

    let columnWidthDistribution = getColumnWidthDistribution(pcfContext);

    for (const column of dataSet.columns){
        let iColumn: IColumn = {
            key: column.name,
            name: column.displayName,
            fieldName: column.alias,
            currentWidth: column.visualSizeFactor,
            minWidth: 5,                
            maxWidth: columnWidthDistribution.find(x => x.name === column.alias)?.width ||column.visualSizeFactor,
            isResizable: true,
            sortAscendingAriaLabel: 'Sorted A to Z',
            sortDescendingAriaLabel: 'Sorted Z to A',
            className: 'detailList-cell',
            headerClassName: 'detailList-gridLabels',
            data: {isPrimary : column.isPrimary} 
        }
        
        //create links for primary field and entity reference.            
        if (column.dataType.startsWith('Lookup.') || column.isPrimary)
        {
            iColumn.onRender = (item: any, index: number | undefined, column: IColumn | undefined)=> (                                    
                <Link key={item.key} onClick={() => navigate(item, column!.fieldName, pcfContext) }>{item[column!.fieldName!]}</Link>                    
            );
        }
        else if(column.dataType === 'SingleLine.Email'){
            iColumn.onRender = (item: any, index: number | undefined, column: IColumn | undefined)=> (                                    
                <Link href={`mailto:${item[column!.fieldName!]}`} >{item[column!.fieldName!]}</Link>  
            );
        }
        else if(column.dataType === 'SingleLine.Phone'){
            iColumn.onRender = (item: any, index: number | undefined, column: IColumn | undefined)=> (                                    
                <Link href={`skype:${item[column!.fieldName!]}?call`} >{item[column!.fieldName!]}</Link>                    
            );
        }

        let isSorted = dataSet?.sorting?.findIndex(s => s.name === column.name) !== -1 || false
        iColumn.isSorted = isSorted;
        if (isSorted){
            iColumn.isSortedDescending = dataSet?.sorting?.find(s => s.name === column.name)?.sortDirection === 1 || false;
        }

        iColumns.push(iColumn);
    }
    return iColumns;
}   

const getColumnWidthDistribution = (pcfContext: ComponentFramework.Context<IInputs>): IColumnWidth[] => {
        
    let widthDistribution: IColumnWidth[] = [];
    let columnsOnView = pcfContext.parameters.sampleDataSet.columns;

    let totalWidth:number = pcfContext.mode.allocatedWidth - 250;
    let widthSum = 0;
    
    columnsOnView.forEach(function (columnItem) {
        widthSum += columnItem.visualSizeFactor;
    });

    let remainWidth:number = totalWidth;
    
    columnsOnView.forEach(function (item, index) {
        let widthPerCell = 0;
        if (index !== columnsOnView.length - 1) {
            let cellWidth = Math.round((item.visualSizeFactor / widthSum) * totalWidth);
            remainWidth = remainWidth - cellWidth;
            widthPerCell = cellWidth;
        }
        else {
            widthPerCell = remainWidth;
        }
        widthDistribution.push({name: item.alias, width: widthPerCell});
    });

    return widthDistribution;

}

const updateColumnWidths = (columns: IColumn[], pcfContext: ComponentFramework.Context<IInputs>) : IColumn[] => {
    let columnWidthDistribution = getColumnWidthDistribution(pcfContext);        
    let currentColumns = columns;    

    return currentColumns.map(col => {           

        const newMaxWidth = columnWidthDistribution.find(x => x.name === col.fieldName);
        if (newMaxWidth) col.maxWidth = newMaxWidth.width;

        return col;
      });        
}

const copyAndSort = <T, >(items: T[], columnKey: string, pcfContext: ComponentFramework.Context<IInputs>, isSortedDescending?: boolean): T[] =>  {
    let key = columnKey as keyof T;
    let sortedItems = items.slice(0);        
    sortedItems.sort((a: T, b: T) => (a[key] || '' as any).toString().localeCompare((b[key] || '' as any).toString(), getUserLanguage(pcfContext), { numeric: true }));

    if (isSortedDescending) {
        sortedItems.reverse();
    }

    return sortedItems;
}

const getUserLanguage = (pcfContext: ComponentFramework.Context<IInputs>): string => {
    const language = lcid.from(pcfContext.userSettings.languageId);
    return language.substring(0, language.indexOf('_'));
} 

const isEntityReference = (obj: any): obj is ComponentFramework.EntityReference => {
    return typeof obj?.etn === 'string';
}
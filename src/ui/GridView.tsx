import {View, Text} from 'react-native';

interface Props<T> {
  data: T[];
  renderItem: (item: T) => JSX.Element;
  col?: number;
}

const GridView = <T extends any>({data, col = 2, renderItem}: Props<T>) => {
  return (
    <View style={{width: '100%', flexDirection: 'row', flexWrap: 'wrap'}}>
      {data?.map((item, i) => (
        <View key={i} style={{width: `${100 / col}%`}}>
          <View style={{padding: 5}}>{renderItem(item)}</View>
        </View>
      ))}
    </View>
  );
};

export default GridView;

import { Input } from "./Input";

type TextareaProps = {
	label?: string;
	error?: string;
	placeholder?: string;
	value: string;
	onChangeText: (text: string) => void;
	numberOfLines?: number;
	disabled?: boolean;
};

export function Textarea(props: TextareaProps) {
	return (
		<Input {...props} multiline numberOfLines={props.numberOfLines || 4} />
	);
}

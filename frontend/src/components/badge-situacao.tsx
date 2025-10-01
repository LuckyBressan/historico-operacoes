import { cva, type VariantProps } from "class-variance-authority"
import { Badge } from "./ui/badge"

export const badgeVariants = cva(
    "capitalize",
    {
        variants: {
            variant: {
                none: '',
                primary: 'bg-success-light text-success-dark',
                secondary: 'bg-alert-alt-light text-alert-alt-dark',
                tertiary: 'bg-danger-lightest text-danger-dark'
            }
        },
        defaultVariants: {
            variant: 'primary'
        }
    }
)

interface BadgeSituacaoProps
    extends React.ComponentProps<'span'>,
        VariantProps<typeof badgeVariants> {}

export default function BadgeSituacao({
    variant,
    className,
    children,
    ...props
}: BadgeSituacaoProps) {
    return (
        <Badge
            className={badgeVariants({ variant, className })}
            {...props}
        >
            {children}
        </Badge>
    )
};
